import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="toast-container animate-fade-in">
      <div className="toast-card">
        <CheckCircle2 size={20} className="toast-icon" />
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={onClose} aria-label="Dismiss notification">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
