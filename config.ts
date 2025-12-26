
import { TicketPercent, Tag } from 'lucide-react';

// ============================================================================
// CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  // Toggle this to 'PROD' to use real Firebase Backend
  mode: 'TEST' as 'TEST' | 'PROD', 
  
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
  }
};

export const BRAND_CONFIG = {
  appName: "vistaloyalty",
  companyName: "VistaDeck",
  primaryColor: 'orange', 
  logoIcon: TicketPercent, 
  favicon: Tag,
  
  // Default user display info (fallback)
  defaultUser: {
    name: "Admin User",
    email: "admin@vistaloyalty.com",
    initials: "AD",
    role: "SUPER_ADMIN"
  }
};

export const AUTH_CONFIG = {
  users: [
    {
      mobile: "9999999999",
      password: "admin",
      role: 'SUPER_ADMIN',
      name: "Head Office",
      email: "hq@vistaloyalty.com",
      initials: "HQ"
    },
    {
      mobile: "8888888888",
      password: "store",
      role: 'STORE_ADMIN',
      name: "Mumbai Distributor",
      email: "mumbai@vistaloyalty.com",
      initials: "MD"
    },
    {
      mobile: "7777777777",
      password: "user",
      role: 'MEMBER',
      name: "Ramesh Carpenter",
      email: "ramesh@gmail.com",
      initials: "RC",
      points: 2450,
      tier: 'Gold'
    }
  ]
};

export const ADSENSE_CONFIG = {
  enabled: true,
  clientId: "ca-pub-0000000000000000",
  slots: {
    dashboard_banner: "1234567890",
    header_spot: "1111111111",
    inline_coupon: "2222222222",
    footer_grid_1: "3333333333",
    footer_grid_2: "4444444444",
  }
};

export const FEATURES = {};
