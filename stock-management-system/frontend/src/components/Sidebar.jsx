import { NavLink } from 'react-router-dom';

const links = [
  ['/', 'Dashboard'], ['/products', 'Products'], ['/categories', 'Categories'],
  ['/suppliers', 'Suppliers'], ['/purchases', 'Purchases'], ['/sales', 'Sales'],
  ['/stock', 'Stock'], ['/reports', 'Reports'], ['/profile', 'Profile / Settings'],
];

export default function Sidebar({ open, close }) {
  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      <h2>Stock Manager</h2>
      {links.map(([to, label]) => (
        <NavLink key={to} to={to} end={to === '/'} onClick={close}>{label}</NavLink>
      ))}
    </aside>
  );
}
