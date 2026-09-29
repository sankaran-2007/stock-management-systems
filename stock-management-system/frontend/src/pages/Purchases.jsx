import { useEffect, useState } from 'react';
import Crud, { money, today } from '../components/Crud.jsx';
import api from '../services/api';

export default function Purchases() {
  const [prods, setProds] = useState([]);
  const [sups, setSups] = useState([]);
  useEffect(() => {
    api.get('/products').then((r) => setProds(r.data)).catch(() => {});
    api.get('/suppliers').then((r) => setSups(r.data)).catch(() => {});
  }, []);
  const opt = (a) => a.map((x) => ({ value: x.id, label: x.name }));

  return (
    <Crud
      title="Purchases" singular="Purchase" endpoint="/purchases"
      columns={[
        { key: 'id', label: 'ID' }, { key: 'purchase_date', label: 'Date' },
        { key: 'product_name', label: 'Product' }, { key: 'supplier_name', label: 'Supplier' },
        { key: 'quantity', label: 'Qty' },
        { key: 'purchase_price', label: 'Price', render: (r) => money(r.purchase_price) },
        { key: 'total_amount', label: 'Total', render: (r) => money(r.total_amount) },
      ]}
      filters={[
        { key: 'product_id', label: 'All products', options: opt(prods) },
        { key: 'supplier_id', label: 'All suppliers', options: opt(sups) },
      ]}
      fields={Object.assign([
        { name: 'product_id', label: 'Product', type: 'select', required: true, options: opt(prods) },
        { name: 'supplier_id', label: 'Supplier', type: 'select', required: true, options: opt(sups) },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1 },
        { name: 'purchase_price', label: 'Purchase Price (blank = product price)', type: 'number', step: '0.01' },
        { name: 'purchase_date', label: 'Purchase Date', type: 'date', required: true, default: today() },
      ], { noDelete: true })}
    />
  );
}
