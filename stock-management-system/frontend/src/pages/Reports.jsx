import { useState } from 'react';
import Crud, { badge, money } from '../components/Crud.jsx';

const stockCols = [
  { key: 'name', label: 'Product' }, { key: 'category_name', label: 'Category' },
  { key: 'quantity', label: 'Quantity' }, { key: 'min_stock_level', label: 'Min Level' },
  { key: 'stock_value', label: 'Stock Value', render: (r) => money(r.stock_value) },
  { key: 'status', label: 'Status', render: (r) => badge(r.status) },
];

const reports = {
  stock: { label: 'Current / Product-wise Stock', endpoint: '/reports/stock', columns: stockCols },
  sales: {
    label: 'Sales', endpoint: '/reports/sales',
    columns: [
      { key: 'sale_date', label: 'Date' }, { key: 'product_name', label: 'Product' },
      { key: 'customer_name', label: 'Customer' }, { key: 'quantity', label: 'Qty' },
      { key: 'total_amount', label: 'Total', render: (r) => money(r.total_amount) },
    ],
  },
  purchases: {
    label: 'Purchases', endpoint: '/reports/purchases',
    columns: [
      { key: 'purchase_date', label: 'Date' }, { key: 'product_name', label: 'Product' },
      { key: 'supplier_name', label: 'Supplier' }, { key: 'quantity', label: 'Qty' },
      { key: 'total_amount', label: 'Total', render: (r) => money(r.total_amount) },
    ],
  },
  low: { label: 'Low Stock', endpoint: '/reports/low-stock', columns: stockCols },
};

export default function Reports() {
  const [tab, setTab] = useState('stock');
  const r = reports[tab];
  return (
    <>
      <div className="tabs no-print">
        {Object.entries(reports).map(([k, v]) => (
          <button key={k} className={'tab' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{v.label}</button>
        ))}
      </div>
      <Crud key={tab} title={r.label + ' Report'} endpoint={r.endpoint} columns={r.columns} readOnly />
    </>
  );
}
