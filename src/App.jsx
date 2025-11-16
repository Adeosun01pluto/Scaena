import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AnnouncementBar from "./components/AnnouncementBar.jsx";
import CollectionDetail from "./pages/CollectionDetail.jsx";

import Home from "./pages/Home";
import Collections from "./pages/Collections";
import Supplies from "./pages/Supplies";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Artworks from "./pages/Artworks.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx"; // ✅ Orders page
import RequireAdmin from "./components/RequireAdmin.jsx"; // ✅ Guard
import ScrollToTop from "./pages/ScrollToTop.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-stone-200 text-stone-800 selection:bg-stone-900 selection:text-stone-100">
      <AnnouncementBar />
      <Header />

      <main className="fade-in-up">
        <ScrollToTop /> {/* 👈 will run on every route change */}

        <Routes>
          {/* Public storefront */}
          <Route path="/" element={<Home />} />
          <Route path="/supplies" element={<Supplies />} />
          <Route path="/artworks" element={<Artworks />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:name" element={<CollectionDetail />} />
          <Route path="/products/:type/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin (protected) */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
          </Route>

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

