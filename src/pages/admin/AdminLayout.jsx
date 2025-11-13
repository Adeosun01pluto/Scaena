import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, ImagePlus, Package } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-stone-100">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="text-lg font-semibold">Admin • 세나</div>
          <NavLink to="/" className="text-sm text-stone-600 hover:underline">View Store</NavLink>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="h-max rounded-xl border bg-white p-3">
          <nav className="space-y-1 text-sm">
            <Item to="/admin" icon={<LayoutDashboard size={16} />}>Overview</Item>
            <Item to="/admin/users" icon={<Users size={16} />}>Users</Item>
            <Item to="/admin/categories" icon={<FolderKanban size={16} />}>Categories</Item>
            <Item to="/admin/products" icon={<Package size={16} />}>Products</Item>
            <Item to="/admin/products/new" icon={<ImagePlus size={16} />}>New Product</Item>
          </nav>
        </aside>

        {/* Content */}
        <section><Outlet /></section>
      </div>
    </div>
  );
}

function Item({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-stone-100 ${isActive ? "bg-stone-100 font-medium" : ""}`
      }
    >
      {icon}{children}
    </NavLink>
  );
}
