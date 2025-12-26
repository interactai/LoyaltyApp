
import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", style }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} style={style}></div>
);

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-10 rounded-2xl" />
    </div>
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-4 w-16 rounded-full" />
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <Skeleton className="h-6 w-20" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 h-80 flex flex-col">
    <div className="flex justify-between items-center mb-8">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="flex-1 flex items-end gap-2 px-2">
      {[...Array(12)].map((_, i) => (
        <Skeleton 
          key={i} 
          className="flex-1" 
          style={{ height: `${Math.random() * 100}%` }} 
        />
      ))}
    </div>
  </div>
);
