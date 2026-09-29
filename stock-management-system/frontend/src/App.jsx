import { useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import Categories from './pages/Categories.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Products from './pages/Products.jsx';
import Profile from './pages/Profile.jsx';
import Purchases from './pages/Purchases.jsx';
import Reports from './pages/Reports.jsx';
import Sales from './pages/Sales.jsx';
import Stock from './pages/Stock.jsx';
import Suppliers from './pages/Suppliers.jsx';

function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app">
      <Sidebar open={open} close={() => setOpen(false)} />
      <div className="main">
        <Navbar toggle={() => setOpen(!open)} />
        <div className="content"><Outlet /></div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
