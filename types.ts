

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ANALYTICS = 'ANALYTICS',
  CUSTOMERS = 'CUSTOMERS',
  STORES = 'STORES',
  GIFT_CARDS = 'GIFT_CARDS',
  INVOICE_APPROVALS = 'INVOICE_APPROVALS',
  MARKETING = 'MARKETING',
  SETTINGS = 'SETTINGS',
  VISTADECK_UPSELL = 'VISTADECK_UPSELL',
  PAYOUTS = 'PAYOUTS',
  HELP = 'HELP'
}

export type UserRole = 'SUPER_ADMIN' | 'STORE_ADMIN' | 'MEMBER';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  note?: string;
  status?: 'Success' | 'Processing' | 'Failed';
}

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Rejected';
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  initials: string;
  points?: number;
  tier?: string;
  mobile?: string;
  history?: Transaction[];
  gstNumber?: string;
  upiId?: string;
  storeBalances?: Record<string, number>;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Banned';
  pointsBalance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  lifetimePoints: number;
  history: Transaction[];
  upiId?: string;
  storeBalances?: Record<string, number>;
}

export interface LoyaltyBatch {
  id: string;
  name: string;
  pointsPerCode: number;
  quantity: number;
  createdDate: string;
  status: 'Active' | 'Printed' | 'Expired';
  codes: GiftCard[];
  storeId?: string;
}

export interface GiftCard {
  id: string;
  code: string;
  type: 'CASH_VALUE' | 'POINT_VOUCHER';
  value: number;
  status: 'Active' | 'Redeemed' | 'Expired';
  expiryDate?: string;
  createdDate: string;
  batchId?: string;
}

export interface InvoiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  productDetails?: string;
  rejectionReason?: string;
  storeName?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  isActive: boolean;
  storeId?: string;
  createdAt: string;
  createdBy: string;
  link?: string;
}

// Added creative branding properties to fix TypeScript errors in BrandingKitView.tsx
export interface GeneralSettings {
  theme?: 'light' | 'dark' | 'system';
  qrBrandName?: string;
  qrMysteryText?: string;
  qrScanText?: string;
  primaryColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  creativeHeadline?: string;
  creativeSubheadline?: string;
  creativeCTA?: string;
  creativeContact?: string;
}

export interface Interaction {
  id: string;
  type: 'email' | 'call' | 'whatsapp' | 'note' | 'status' | 'reminder';
  content: string;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  source: string;
  date: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  notes?: string[];
  history?: Interaction[];
  lastContact?: string;
  reminder?: string;
  tags?: string[];
  fitScore?: number;
}