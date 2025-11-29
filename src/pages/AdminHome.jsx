import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import StatCard from "../components/admin/StatCard";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: orderData } = await axios.get("/api/admin/orders");
    const { data: productData } = await axios.get("/api/products");
    const { data: userData } = await axios.get("/api/users");

    const totalRevenue = orderData.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const monthly = {};
    orderData.orders.forEach(o => {
      const month = new Date(o.createdAt).toLocaleString("default", { month: "short" });
      monthly[month] = (monthly[month] || 0) + o.totalAmount;
    });

    setChartData(Object.keys(monthly).map(m => ({ month: m, revenue: monthly[m] })));
    setRecentOrders(orderData.orders.slice(0, 5));
    setStats({
      totalOrders: orderData.orders.length,
      totalProducts: productData.products?.length || 0,
      totalUsers: userData.users?.length || 0,
      totalRevenue,
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard title="Total Products" value={stats.totalProducts} />
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} />
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
          <table className="min-w-full">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id} className="border-b">
                  <td className="p-2">{o.address.name}</td>
                  <td className="p-2">₹{o.totalAmount}</td>
                  <td className="p-2">{o.orderStatus}</td>
                  <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
