export type StockMovementListItem = {
  id: string;
  date: string;
  productName: string;
  type: "Sale" | "Stock in" | "Stock out" | "Stock count" | "Void";
  quantityDelta: number;
  reason: string;
  staffName: string;
};

export const demoMovements: StockMovementListItem[] = [
  { id: "m-001", date: "2026-10-04T09:21:00+07:00", productName: "Sparkling Water 500 ml", type: "Sale", quantityDelta: -2, reason: "Receipt POS-20261004-0001", staffName: "Mali Cashier" },
  { id: "m-002", date: "2026-10-04T09:00:00+07:00", productName: "Seaweed Crisps", type: "Stock in", quantityDelta: 12, reason: "Morning replenishment", staffName: "Niran Admin" },
  { id: "m-003", date: "2026-10-04T08:45:00+07:00", productName: "Kitchen Towel Roll", type: "Stock count", quantityDelta: -1, reason: "Shelf count correction", staffName: "Niran Admin" },
];
