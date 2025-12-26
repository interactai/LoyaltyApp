
import React from 'react';
import { User } from '../types';
import { PointsManager } from './loyalty/PointsManager';
import { CouponGenerator } from './loyalty/CouponGenerator';
import { BillApprovals } from './loyalty/BillApprovals';

interface LoyaltySuiteProps {
  mode: 'points' | 'giftcards' | 'invoices';
  user?: User;
}

export const LoyaltySuite: React.FC<LoyaltySuiteProps> = ({ mode, user }) => {
  if (mode === 'points') {
    return <PointsManager />;
  }
  
  if (mode === 'giftcards') {
    return <CouponGenerator user={user} />;
  }

  if (mode === 'invoices') {
    return <BillApprovals user={user} />;
  }

  return <div>Select a mode</div>;
};
