
import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotification, NotificationType } from '../contexts/NotificationContext';

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    default: return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getBgColor = (type: NotificationType) => {
  switch (type) {
    case 'success': return 'bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900/50';
    case 'error': return 'bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900/50';
    case 'warning': return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-100 dark:border-yellow-900/50';
    default: return 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800';
  }
};

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {notifications.map((note) => (
        <div 
          key={note.id}
          className={`pointer-events-auto w-full p-4 rounded-xl border shadow-lg flex items-start animate-slide-in transition-colors ${getBgColor(note.type)}`}
        >
          <div className="shrink-0 mt-0.5">
            {getIcon(note.type)}
          </div>
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{note.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{note.message}</p>
          </div>
          <button 
            onClick={() => removeNotification(note.id)}
            className="ml-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
