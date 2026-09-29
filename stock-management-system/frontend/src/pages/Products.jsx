import { useEffect, useState } from 'react';
import Crud, { badge, money } from '../components/Crud.jsx';
import api from '../services/api';

export default function Products() {
  const [cats, setCats] = useState([]);
  const [sups, setSups] = useState([]);
  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {});
    api.get('/suppliers').then((r) => setSups(r.data)).catch(() => {});
  }, []);
  const opt = (a) => a.map((x) => ({ value: x.id, label: x.name }));

  return (
    <Crud
      title="Products" singular="Product" endpoint="/products"
      columns={[
        { key: 'id', label: 'ID' }, { key: 'name', label: 'Product Name' },
        { key: 'category_name', label: 'Category' }, { key: 'supplier_name', label: 'Supplier' },
        { key: 'quantity', label: 'Qty' },
        { key: 'purchase_price', label: 'Purchase Price', render: (r) => money(r.purchase_price) },
        { key: 'selling_price', label: 'Selling Price', render: (r) => money(r.selling_price) },
        { key: 'min_stock_level', label: 'Min Level' },
        { key: 'status', label: 'Status', render: (r) => badge(r.status) },
      ]}
      filters={[
        { key: 'category_id', label: 'All categories', options: opt(cats) },
        { key: 'supplier_id', label: 'All suppliers', options: opt(sups) },
        { key: 'status', label: 'All stock status', options: [{ value: 'In Stock', label: 'In Stock' }, { value: 'Low Stock', label: 'Low Stock' }] },
      ]}
      fields={[
        { name: 'name', label: 'Product Name', required: true },
        { name: 'category_id', label: 'Category', type: 'select', required: true, options: opt(cats) },
        { name: 'supplier_id', label: 'Supplier', type: 'select', required: true, options: opt(sups) },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true, default: 0 },
        { name: 'purchase_price', label: 'Purchase Price', type: 'number', step: '0.01', required: true },
        { name: 'selling_price', label: 'Selling Price', type: 'number', step: '0.01', required: true },
        { name: 'min_stock_level', label: 'Minimum Stock Level', type: 'number', required: true, default: 5 },
        { name: 'description', label: 'Product Description', type: 'textarea' },
      ]}
    />
  );
}
