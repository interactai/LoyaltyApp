
import { LoyaltyBatch, GiftCard, User, UserRole, Customer, InvoiceRequest, PromoBanner, Transaction, PayoutRequest } from '../types';
import { AUTH_CONFIG, APP_CONFIG } from '../config';

// Import Real Backend Implementation
import { 
    FirebaseAuthService, 
    FirebaseGiftCardService, 
    FirebaseInvoiceService, 
    FirebaseMarketingService, 
    FirebaseMemberService, 
    FirebaseStoreService 
} from './firebaseImplementation';

// ============================================================================
// MOCK DATA STORE (Lazy Loaded)
// ============================================================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for local storage persistence
const getStorage = <T>(key: string, defaultVal: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
};

const setStorage = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error("Storage Error", e);
    }
};

// ============================================================================
// MOCK IMPLEMENTATIONS
// ============================================================================

const MockAuthService = {
  getAllUsers: (): any[] => {
    const dynamicUsers = getStorage('registeredUsers', []);
    return [...AUTH_CONFIG.users, ...dynamicUsers];
  },

  login: async (mobile: string, password: string): Promise<User | null> => {
    await delay(300);
    const allUsers = MockAuthService.getAllUsers();
    const foundUser = allUsers.find(u => u.mobile === mobile && u.password === password);
    
    if (foundUser) {
        // Hydrate with member data if exists
        const members = await MockMemberService.getAllMembers();
        const memberProfile = members.find(m => m.phone === mobile);
        
        return {
            id: foundUser.mobile,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role as UserRole,
            initials: foundUser.initials,
            points: memberProfile ? memberProfile.pointsBalance : (foundUser.points || 0),
            tier: memberProfile ? memberProfile.tier : (foundUser.tier || 'Bronze'),
            history: memberProfile ? memberProfile.history : [],
            storeBalances: memberProfile ? memberProfile.storeBalances : { 'Mumbai Distributor': 2450 } // Mock default store balance
        };
    }
    return null;
  },

  sendOtp: async (mobile: string): Promise<string> => {
    await delay(500);
    return "1234";
  },

  verifyOtp: async (mobile: string, otp: string): Promise<boolean> => {
      await delay(300);
      return otp === "1234";
  },

  register: async (userData: any): Promise<User> => {
    await delay(500);
    const allUsers = MockAuthService.getAllUsers();
    if (allUsers.find(u => u.mobile === userData.mobile)) {
      throw new Error("User already exists.");
    }

    const newUser = {
      ...userData,
      email: userData.email || undefined,
      initials: (userData.name || 'User').substring(0, 2).toUpperCase(),
      points: 0,
      tier: 'Bronze'
    };

    const storedUsers = getStorage('registeredUsers', []);
    storedUsers.push(newUser);
    setStorage('registeredUsers', storedUsers);

    if (userData.role === 'MEMBER') {
       const members = await MockMemberService.getAllMembers();
       members.push({
          id: `L${Date.now()}`,
          name: newUser.name,
          email: newUser.email || '',
          phone: newUser.mobile,
          joinDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          pointsBalance: 0,
          tier: 'Bronze',
          lifetimePoints: 0,
          history: [],
          storeBalances: {}
       });
       setStorage('vista_members', members);
    }

    return {
      id: newUser.mobile,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      initials: newUser.initials,
      points: 0,
      tier: 'Bronze',
      history: []
    };
  }
};

const MockMemberService = {
  getAllMembers: async (): Promise<Customer[]> => {
    await delay(200);
    return getStorage<Customer[]>('vista_members', [
        { 
            id: 'L101', name: 'Ramesh Carpenter', email: 'ramesh@gmail.com', phone: '7777777777', 
            joinDate: '2023-01-01', status: 'Active', pointsBalance: 2450, tier: 'Gold', lifetimePoints: 5200,
            history: [{ id: 't1', date: new Date().toISOString().split('T')[0], amount: 450, type: 'CREDIT', note: 'Bill #9988 Approved', status: 'Success' }],
            storeBalances: { 'Mumbai Distributor': 2000, 'Pune Hardware': 450 }
        },
        { id: 'L102', name: 'Suresh Electric', email: 'suresh@gmail.com', phone: '9876543211', joinDate: '2023-02-15', status: 'Active', pointsBalance: 450, tier: 'Bronze', lifetimePoints: 450, history: [], storeBalances: { 'Mumbai Distributor': 450 } },
    ]);
  },
  
  getMemberByPhone: async (phone: string): Promise<Customer | undefined> => {
    const members = await MockMemberService.getAllMembers();
    return members.find(m => m.phone === phone);
  },

  updateMemberPoints: async (memberId: string, amount: number, type: 'add' | 'redeem', note?: string, storeId?: string): Promise<Customer> => {
    await delay(300);
    const members = await MockMemberService.getAllMembers();
    const index = members.findIndex(m => m.id === memberId || m.phone === memberId);
    
    if (index === -1) throw new Error("Member not found");

    const member = members[index];
    
    if (type === 'redeem' && member.pointsBalance < amount) {
        throw new Error("Insufficient balance");
    }

    const newBalance = type === 'add' ? member.pointsBalance + amount : member.pointsBalance - amount;
    const newLifetime = type === 'add' ? member.lifetimePoints + amount : member.lifetimePoints;

    let updatedStoreBalances = { ...member.storeBalances };
    if (storeId) {
        const currentStoreBalance = updatedStoreBalances[storeId] || 0;
        updatedStoreBalances[storeId] = type === 'add' ? currentStoreBalance + amount : Math.max(0, currentStoreBalance - amount);
    }

    const transaction: Transaction = {
      id: `TXN${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      type: type === 'add' ? 'CREDIT' : 'DEBIT',
      note: note || (type === 'add' ? 'Points Added' : 'Redemption'),
      status: 'Success'
    };

    const updatedMember = {
      ...member,
      pointsBalance: newBalance,
      lifetimePoints: newLifetime,
      storeBalances: updatedStoreBalances,
      history: [transaction, ...(member.history || [])]
    };

    members[index] = updatedMember;
    setStorage('vista_members', members);
    return updatedMember;
  },

  requestPayout: async (memberId: string, amount: number, upiId: string): Promise<Transaction> => {
     await delay(800);
     const members = await MockMemberService.getAllMembers();
     const index = members.findIndex(m => m.id === memberId || m.phone === memberId);
     
     if (index === -1) throw new Error("Member not found");
     const member = members[index];

     if (member.pointsBalance < amount) throw new Error("Insufficient balance");

     const newBalance = member.pointsBalance - amount;
     const date = new Date().toISOString().split('T')[0];
     
     const transaction: Transaction = {
       id: `PAY${Date.now()}`,
       date: date,
       amount: amount,
       type: 'DEBIT',
       note: `Payout to ${upiId}`,
       status: 'Processing'
     };

     // ADD TO GLOBAL PAYOUTS FOR ADMIN
     const payouts = getStorage<PayoutRequest[]>('vista_payouts', []);
     payouts.unshift({
        id: `PR-${Date.now()}`,
        userId: memberId,
        userName: member.name,
        amount: amount,
        upiId: upiId,
        date: date,
        status: 'Pending'
     });
     setStorage('vista_payouts', payouts);

     const updatedMember = {
       ...member,
       pointsBalance: newBalance,
       upiId: upiId,
       history: [transaction, ...(member.history || [])]
     };

     members[index] = updatedMember;
     setStorage('vista_members', members);
     return transaction;
  }
};

const MockGiftCardService = {
  getAllBatches: async (): Promise<LoyaltyBatch[]> => {
    await delay(200);
    return getStorage<LoyaltyBatch[]>('vista_batches', []);
  },

  createBatch: async (batch: LoyaltyBatch): Promise<LoyaltyBatch> => {
     await delay(300);
     const batches = await MockGiftCardService.getAllBatches();
     batches.unshift(batch);
     setStorage('vista_batches', batches);
     return batch;
  },

  redeemCode: async (code: string, storeId?: string, userPhone?: string): Promise<{ success: boolean; value: number; message: string }> => {
    await delay(500);
    const batches = await MockGiftCardService.getAllBatches();
    
    let foundCode: GiftCard | undefined;
    let batchIndex = -1;

    for (let i = 0; i < batches.length; i++) {
        const c = batches[i].codes.find(cx => cx.code === code);
        if (c) {
            foundCode = c;
            batchIndex = i;
            break;
        }
    }

    if (!foundCode || batchIndex === -1) {
      return { success: false, value: 0, message: 'Invalid code.' };
    }

    const batch = batches[batchIndex];

    if (batch.storeId && storeId && batch.storeId !== storeId) {
        return { success: false, value: 0, message: `Invalid store for this coupon.` };
    }
    if (foundCode.status !== 'Active') {
      return { success: false, value: 0, message: `Code already ${foundCode.status}.` };
    }

    foundCode.status = 'Redeemed';
    setStorage('vista_batches', batches);

    if (userPhone) {
        await MockMemberService.updateMemberPoints(userPhone, foundCode.value, 'add', `Coupon: ${code}`, batch.storeId);
    }

    return { success: true, value: foundCode.value, message: 'Success!' };
  }
};

const MockInvoiceService = {
  getAllInvoices: async (storeName?: string): Promise<InvoiceRequest[]> => {
    await delay(200);
    const invoices = getStorage<InvoiceRequest[]>('vista_invoices', [
        { id: 'INV-1', customerId: 'L102', customerName: 'Suresh Electric', invoiceNumber: 'BILL-9988', amount: 5000, date: new Date().toISOString().split('T')[0], status: 'Pending', storeName: 'Mumbai Distributor' }
    ]);
    return storeName ? invoices.filter(i => i.storeName === storeName) : invoices;
  },

  updateInvoiceStatus: async (id: string, status: 'Approved' | 'Rejected'): Promise<InvoiceRequest> => {
    const invoices = await MockInvoiceService.getAllInvoices();
    const index = invoices.findIndex(i => i.id === id);
    if (index === -1) throw new Error("Invoice not found");
    
    invoices[index].status = status;
    setStorage('vista_invoices', invoices);
    return invoices[index];
  },

  updateInvoiceAmount: async (id: string, amount: number): Promise<void> => {
    const invoices = await MockInvoiceService.getAllInvoices();
    const index = invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      invoices[index].amount = amount;
      setStorage('vista_invoices', invoices);
    }
  }
};

const MockStoreService = {
  getAllStores: async (): Promise<any[]> => {
    await delay(200);
    const allUsers = MockAuthService.getAllUsers();
    const stores = allUsers.filter(u => u.role === 'STORE_ADMIN');
    const settingsDB = getStorage<Record<string, any>>('store_settings', {});
    const batches = await MockGiftCardService.getAllBatches();

    return stores.map(store => {
        const storeBatches = batches.filter(b => b.storeId === store.name);
        const settings = settingsDB[store.name] || { customerQuota: 500, pointsQuota: 500000, status: 'Active' };
        
        return {
            ...store,
            accountStatus: settings.status,
            slug: settings.slug || store.name.toLowerCase().replace(/\s+/g, '-'),
            stats: {
                couponsGenerated: storeBatches.reduce((acc, b) => acc + b.quantity, 0),
                pointsGenerated: storeBatches.reduce((acc, b) => acc + (b.quantity * b.pointsPerCode), 0),
                billsApproved: 0
            }
        };
    });
  },

  updateStoreSettings: async (storeId: string, settings: any): Promise<void> => {
      const db = getStorage<Record<string, any>>('store_settings', {});
      db[storeId] = settings;
      setStorage('store_settings', db);
  },

  createStore: async (storeData: any): Promise<any> => {
      await delay(500);
      const newUser = {
          name: storeData.name,
          mobile: storeData.mobile,
          email: storeData.email,
          password: 'store', 
          role: 'STORE_ADMIN',
          initials: storeData.name.substring(0, 2).toUpperCase()
      };
      
      const storedUsers = getStorage<any[]>('registeredUsers', []);
      if (storedUsers.find(u => u.mobile === newUser.mobile)) throw new Error("Mobile exists");
      
      storedUsers.push(newUser);
      setStorage('registeredUsers', storedUsers);

      const db = getStorage<Record<string, any>>('store_settings', {});
      db[newUser.name] = { status: 'Active', slug: storeData.slug, customerQuota: 500, pointsQuota: 100000 };
      setStorage('store_settings', db);

      return { ...newUser, slug: storeData.slug };
  }
};

const MockMarketingService = {
  getAllBanners: async (storeId?: string): Promise<PromoBanner[]> => {
    await delay(200);
    const banners = getStorage<PromoBanner[]>('vista_banners', [
        { id: 'B1', title: 'Diwali Sale', imageUrl: 'https://images.unsplash.com/photo-1635425028821-252e4d0d5248', isActive: true, createdAt: '2023-10-20', createdBy: 'HQ' }
    ]);
    return banners.filter(b => !b.storeId || b.storeId === storeId);
  },

  getActiveBanners: async (storeId?: string): Promise<PromoBanner[]> => {
    const banners = await MockMarketingService.getAllBanners(storeId);
    return banners.filter(b => b.isActive);
  },

  createBanner: async (banner: Omit<PromoBanner, 'id' | 'createdAt'>): Promise<PromoBanner> => {
    const banners = await MockMarketingService.getAllBanners();
    const newBanner = { ...banner, id: `B${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    banners.unshift(newBanner);
    setStorage('vista_banners', banners);
    return newBanner;
  },

  toggleBanner: async (id: string): Promise<void> => {
    const banners = await MockMarketingService.getAllBanners();
    const b = banners.find(x => x.id === id);
    if(b) {
        b.isActive = !b.isActive;
        setStorage('vista_banners', banners);
    }
  },

  deleteBanner: async (id: string): Promise<void> => {
    const banners = await MockMarketingService.getAllBanners();
    setStorage('vista_banners', banners.filter(b => b.id !== id));
  }
};

const useProd = APP_CONFIG.mode === 'PROD';

export const AuthService = useProd ? FirebaseAuthService : MockAuthService;
export const MemberService = useProd ? FirebaseMemberService : MockMemberService;
export const GiftCardService = useProd ? FirebaseGiftCardService : MockGiftCardService;
export const InvoiceService = useProd ? FirebaseInvoiceService : MockInvoiceService;
export const StoreService = useProd ? FirebaseStoreService : MockStoreService;
export const MarketingService = useProd ? FirebaseMarketingService : MockMarketingService;
