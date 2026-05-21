const ORDER_STATUS_LABELS: Record<string, string> = {
  PendingPayment: 'Pending Payment',
  Pending: 'Pending',
  Paid: 'Paid',
  Processing: 'Processing',
  Preparing: 'Preparing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
};

const ORDER_STATUS_CSS_CLASSES: Record<string, string> = {
  PendingPayment: 'pending-payment',
  Pending: 'pending',
  Paid: 'paid',
  Processing: 'processing',
  Preparing: 'processing',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function orderStatusClass(status: string): string {
  return ORDER_STATUS_CSS_CLASSES[status] ?? 'pending';
}
