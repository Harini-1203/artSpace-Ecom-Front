import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await axios.get(`${API_URL}/api/admin/orders`);
    setOrders(data.orders);
  };

  const handleStatusChange = async (id, status) => {
    await axios.patch(`${API_URL}/api/admin/orders/${id}/status`, { orderStatus: status });
    fetchOrders(); // Refresh table`${API_URL}
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id} className="border-t">
              <td>{o._id}</td>
              <td>{o.address.name}</td>
              <td>₹{o.totalAmount}</td>
              <td>
                <select
                  value={o.orderStatus}
                  onChange={e => handleStatusChange(o._id, e.target.value)}
                  className="border p-1"
                >
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
              <td>{o.paymentStatus}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <a href={`/admin/orders/${o._id}`} className="text-blue-500 underline">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Orders;
