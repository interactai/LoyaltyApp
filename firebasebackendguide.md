# VistaEngage: Firebase Backend Migration Guide

This guide outlines the steps to migrate **VistaEngage** from the current mock `services/backend.ts` to a fully functional real-time backend using **Google Firebase**.

## 1. Prerequisites & Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project (e.g., `vista-engage-prod`).
3.  Navigate to **Project Settings > General** and register a "Web App".
4.  Copy the `firebaseConfig` object.

### Install Dependencies

Run the following command in your terminal:

```bash
npm install firebase
```

## 2. Initialize Firebase

Create a new file `services/firebase.ts` to initialize the app.

```typescript
// services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

## 3. Database Schema (Firestore)

We will replace the in-memory arrays in `services/backend.ts` with Firestore Collections.

### Collection: `users`
Stores profile data for Admins, Store Owners, and Members.
```typescript
interface UserDoc {
  id: string; // Auth UID
  name: string;
  mobile: string;
  email: string;
  role: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'MEMBER';
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  lifetimePoints: number;
  createdAt: Timestamp;
}
```

### Collection: `batches`
Stores metadata about generated sticker batches.
```typescript
interface BatchDoc {
  id: string; // Auto-generated
  name: string;
  pointsPerCode: number;
  quantity: number;
  createdDate: string;
  storeId?: string; // If restricted to specific store
}
```

### Collection: `codes`
Stores individual coupon codes. Storing them at the root level allows for faster querying during redemption.
```typescript
interface CodeDoc {
  code: string; // The text code (e.g., ABCD-1234) - Document ID
  batchId: string;
  value: number;
  status: 'Active' | 'Redeemed' | 'Expired';
  expiryDate: string;
  redeemedBy?: string; // User ID
  redeemedAt?: Timestamp;
  storeId?: string; // Copied from batch for validation
}
```

### Collection: `invoices`
Stores bill upload requests.
```typescript
interface InvoiceDoc {
  id: string;
  userId: string;
  userName: string;
  storeName: string;
  amount: number;
  invoiceNumber: string;
  imageUrl: string; // Firebase Storage URL
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}
```

## 4. Implementing the Services

Replace `services/backend.ts` with real calls. Below are examples for the core functionalities.

### A. Authentication (Phone Auth)
Since VistaEngage relies on Mobile Numbers, enable **Phone Number** sign-in in Firebase Console > Authentication > Sign-in method.

```typescript
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const AuthService = {
  // 1. Send OTP
  sendOtp: async (mobile: string) => {
    // Requires invisible recaptcha element with ID 'recaptcha-container' in DOM
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    const confirmationResult = await signInWithPhoneNumber(auth, `+91${mobile}`, verifier);
    return confirmationResult; // Return this to UI to confirm later
  },

  // 2. Verify OTP & Create User/Session
  verifyOtp: async (confirmationResult: any, otp: string) => {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    
    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      // New User - prompt UI to fill registration details
      return null; 
    }
  }
};
```

### B. Member Service (Points & Leaderboard)

```typescript
import { collection, query, where, getDocs, updateDoc, doc, increment, runTransaction } from "firebase/firestore";
import { db } from "./firebase";

export const MemberService = {
  getAllMembers: async () => {
    const q = query(collection(db, "users"), where("role", "==", "MEMBER"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  updatePoints: async (userId: string, amount: number, type: 'add' | 'deduct') => {
    const userRef = doc(db, "users", userId);
    const value = type === 'add' ? amount : -amount;

    await updateDoc(userRef, {
      points: increment(value),
      lifetimePoints: type === 'add' ? increment(amount) : increment(0)
    });
  }
};
```

### C. Gift Card Service (Redemption Logic)
Redemption requires a **Transaction** to ensure a code isn't redeemed twice simultaneously.

```typescript
import { runTransaction, doc } from "firebase/firestore";
import { db } from "./firebase";

export const GiftCardService = {
  redeemCode: async (code: string, userId: string, storeId: string) => {
    const codeRef = doc(db, "codes", code); // Assuming doc ID is the code string
    const userRef = doc(db, "users", userId);

    try {
      await runTransaction(db, async (transaction) => {
        const codeDoc = await transaction.get(codeRef);
        
        if (!codeDoc.exists()) throw "Invalid Code";
        const data = codeDoc.data();

        if (data.status !== 'Active') throw `Code is ${data.status}`;
        if (data.storeId && data.storeId !== storeId) throw "Invalid Store";

        // 1. Mark code as redeemed
        transaction.update(codeRef, {
          status: 'Redeemed',
          redeemedBy: userId,
          redeemedAt: new Date()
        });

        // 2. Add points to user
        transaction.update(userRef, {
          points: increment(data.value),
          lifetimePoints: increment(data.value)
        });
      });
      return { success: true };
    } catch (e) {
      return { success: false, message: e };
    }
  }
};
```

## 5. Security Rules (firestore.rules)

Secure your data by applying these rules in the Firebase Console.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'SUPER_ADMIN';
    }
    
    function isStoreOwner() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'STORE_ADMIN';
    }

    // User Profiles
    match /users/{userId} {
      // Users can read their own profile, Admins can read all
      allow read: if request.auth.uid == userId || isAdmin() || isStoreOwner();
      allow write: if isAdmin(); // Only admins can update points manually
    }

    // Coupon Codes
    match /codes/{codeId} {
      allow read: if true; // Needed for redemption check
      allow write: if isAdmin(); // Only admins create codes
    }

    // Invoices
    match /invoices/{invoiceId} {
      allow read: if request.auth.uid == resource.data.userId || isAdmin() || isStoreOwner();
      allow create: if request.auth != null;
      allow update: if isAdmin() || isStoreOwner(); // Approvals
    }
  }
}
```

## 6. Storage Rules (storage.rules)

For the "Bill Upload" feature.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /bills/{userId}/{fileName} {
      allow write: if request.auth.uid == userId && request.resource.size < 5 * 1024 * 1024; // Max 2MB
      allow read: if request.auth.uid == userId || isAdmin();
    }
  }
}
```