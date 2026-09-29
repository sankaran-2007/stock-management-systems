import { useEffect, useState } from 'react';
import Crud, { money, today } from '../components/Crud.jsx';
import api from '../services/api';

export default function Sales() {
  const [prods, setProds] = useState([]);
  useEffect(() => {
    api.get('/products').then((r) => setProds(r.data)).catch(() => {});
  }, []);
  const opt = prods.map((p) => ({ value: p.id, label: `${p.name} (stock: ${p.quantity})` }));

  return (
    <Crud
      title="Sales" singular="Sale" endpoint="/sales"
      columns={[
        { key: 'id', label: 'ID' }, { key: 'sale_date', label: 'Date' },
        { key: 'product_name', label: 'Product' }, { key: 'customer_name', label: 'Customer' },
        { key: 'quantity', label: 'Qty' },
        { key: 'selling_price', label: 'Price', render: (r) => money(r.selling_price) },
        { key: 'total_amount', label: 'Total', render: (r) => money(r.total_amount) },
      ]}
      filters={[{ key: 'product_id', label: 'All products', options: prods.map((p) => ({ value: p.id, label: p.name })) }]}
      fields={Object.assign([
        { name: 'product_id', label: 'Product', type: 'select', required: true, options: opt },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1 },
        { name: 'selling_price', label: 'Selling Price (blank = product price)', type: 'number', step: '0.01' },
        { name: 'customer_name', label: 'Customer Name' },
        { name: 'sale_date', label: 'Sale Date', type: 'date', required: true, default: today() },
      ], { noDelete: true })}
    />
  );
}
