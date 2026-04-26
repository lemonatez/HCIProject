import React from 'react';
import { OrderStatus } from '../context/AppContext';

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: 'bg-gray-100 text-gray-700',
    cooking: 'bg-orange-100 text-orange-700',
    ready: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const labels = {
    pending: 'Pending',
    cooking: 'Cooking',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
