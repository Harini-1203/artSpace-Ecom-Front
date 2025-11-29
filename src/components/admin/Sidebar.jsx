import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();
  const linkStyle = (path) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      pathname === path ? "bg-blue-500 text-white" : ""
    }`;

  return (
    <div className="w-64 bg-gray-100 min-h-screen p-4 shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin" className={linkStyle("/admin")}>
          Dashboard
        </Link>
        <Link to="/admin/products" className={linkStyle("/admin/products")}>
          Products
        </Link>
        <Link to="/admin/add-product" className={linkStyle("/admin/add-product")}>
          Add Product
        </Link>
        <Link to="/admin/orders" className={linkStyle("/admin/orders")}>
          Orders
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
