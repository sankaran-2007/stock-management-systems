import { useEffect, useState } from 'react';
import Crud, { badge, money } from '../components/Crud.jsx';
import api from '../services/api';

export default function Stock() {
  const [cats, setCats] = useState([]);
  const [sups, setSups] = useState([]);
  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data)).catch(() => {});
    api.get('/suppliers').then((r) => setSups(r.data)).catch(() => {});
  }, []);
  const opt = (a) => a.map((x) => ({ value: x.id, label: x.name }));

  return (
    <Crud
      title="Stock" endpoint="/reports/stock" readOnly
      columns={[
        { key: 'name', label: 'Product' }, { key: 'category_name', label: 'Category' },
        { key: 'supplier_name', label: 'Supplier' }, { key: 'quantity', label: 'In Stock' },
        { key: 'min_stock_level', label: 'Min Level' },
        { key: 'stock_value', label: 'Stock Value', render: (r) => money(r.stock_value) },
        { key: 'status', label: 'Status', render: (r) => badge(r.status) },
      ]}
      filters={[
        { key: 'category_id', label: 'All categories', options: opt(cats) },
        { key: 'supplier_id', label: 'All suppliers', options: opt(sups) },
        { key: 'status', label: 'All stock status', options: [{ value: 'In Stock', label: 'In Stock' }, { value: 'Low Stock', label: 'Low Stock' }] },
      ]}
    />
  );
}
