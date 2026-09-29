import { useEffect, useState } from 'react';
import Loading from '../components/Loading.jsx';
import { badge, money } from '../components/Crud.jsx';
import api, { errMsg } from '../services/api';

const Bar = ({ label, value, max, color, text }) => (
  <div className="barrow">
    <span>{label}</span>
    <div className="track"><div style={{ width: (max ? (value / max) * 100 : 0) + '%', background: color }} /></div>
    <em>{text ?? value}</em>
  </div>
);

export default function Dashboard() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/dashboard').then((r) => setD(r.data)).catch((e) => setErr(errMsg(e)));
  }, []);

  if (err) return <div className="alert bad">{err}</div>;
  if (!d) return <Loading />;

  const cards = [
    ['Total Products', d.total_products], ['Total Categories', d.total_categories],
    ['Total Suppliers', d.total_suppliers], ['Current Stock', d.current_stock],
    ['Low Stock Products', d.low_stock_count, true], ['Total Sales', money(d.total_sales)],
    ['Total Purchases', money(d.total_purchases)],
  ];
  const maxStock = Math.max(...d.stock_by_category.map((c) => c.quantity), 0);
  const maxMoney = Math.max(d.total_sales, d.total_purchases, 0);

  return (
    <>
      <h1>Dashboard</h1>
      <div className="cards">
        {cards.map(([label, value, warn]) => (
          <div className={'card' + (warn && value > 0 ? ' warn' : '')} key={label}>
            <span>{label}</span><b>{value}</b>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="panel">
          <h3>Stock by category</h3>
          {d.stock_by_category.map((c) => <Bar key={c.name} label={c.name} value={c.quantity} max={maxStock} color="#0f8b8d" />)}
        </div>
        <div className="panel">
          <h3>Sales vs purchases</h3>
          <Bar label="Sales" value={d.total_sales} max={maxMoney} color="#1e8e5a" text={money(d.total_sales)} />
          <Bar label="Purchases" value={d.total_purchases} max={maxMoney} color="#d98e04" text={money(d.total_purchases)} />
        </div>
      </div>

      <div className="panel">
        <h3>Low stock products</h3>
        {d.low_stock.length === 0 ? <p className="muted">All products are above their minimum level.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Supplier</th><th>Quantity</th><th>Minimum</th><th>Status</th></tr></thead>
              <tbody>
                {d.low_stock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td><td>{p.category_name}</td><td>{p.supplier_name}</td>
                    <td>{p.quantity}</td><td>{p.min_stock_level}</td><td>{badge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
