
import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-[60vh] w-full">
    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
  </div>
);
