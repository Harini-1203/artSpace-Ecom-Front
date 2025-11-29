import React, { useEffect, useState } from "react";
import { getOrders } from "../api/orderAPI";
import {
  Package,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Truck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { API_URL } from "../../config.js";


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleToggle = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  const handleCancelOrder = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      alert(data.message || "Order cancelled successfully");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, orderStatus: "Cancelled" } : o))
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        Loading your orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        No orders found 😢
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📦 My Orders
        </h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
            >
              {/* Summary Row */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleToggle(order._id)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.items?.[0]?._id?.images?.[0] || ""}
                    alt={order.items?.[0]?._id?.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.items?.[0]?._id?.name || "Product"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length > 1
                        ? `+${order.items.length - 1} more items`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-lg text-[var(--blue-light)]">
                      ₹{order.totalAmount}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center justify-end gap-1">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {expandedOrder === order._id ? (
                    <ChevronUp size={22} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={22} className="text-gray-500" />
                  )}
                </div>
              </div>
              {/* Order Status */}
                  <div className="flex justify-between mt-5 items-center">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Truck className="text-[var(--brand-blue)]" size={18} />
                      <span className="font-semibold">
                        Status:{" "}
                        <span
                          className={`${
                            order.orderStatus === "Delivered"
                              ? "text-green-600"
                              : order.orderStatus === "Cancelled"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {order.orderStatus || "Processing"}
                        </span>
                      </span>
                    </div>
                  </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="mt-4 border-t pt-4 space-y-4">
                  {order.orderStatus !== "Shipped" &&
                      order.orderStatus !== "Delivered" &&
                      order.orderStatus !== "Cancelled" && (
                      <div>
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                        >
                          <XCircle size={16} /> Cancel
                        </button>
                        <p className="text-black-600 text-sm mt-1">* see policy for full details</p>
                      </div>
                  )}
                  {/* Expected Delivery */}
                  {(order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled") && (
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      Expected Delivery:{" "}
                      <span className="text-gray-700 font-medium">
                        {order.expectedDelivery
                          ? new Date(order.expectedDelivery).toLocaleDateString()
                          : "3-5 days"}
                      </span>
                    </p>
                  )}

                  {/* Items */}
                  {order.items && order.items.length > 1 && (
                  <div className="space-y-3 mt-3">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-4">
                        <img
                          src={item._id?.images?.[0] || ""}
                          alt={item._id?.name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-700">
                            {item._id?.name}
                          </p>
                        </div>
                        <span className="font-medium text-gray-800">
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>)}
                  

                  {/* Refund / Address
                  {order.orderStatus === "Cancelled" && (
                    <div className="flex justify-between items-center border-t pt-3">
                      <div className="text-gray-600 text-sm flex items-center gap-2">
                        <RefreshCw size={14} className="text-green-500" />
                        Refund eligible till:{" "}
                        <span className="text-gray-800 font-semibold">
                          {new Date(
                            new Date(order.updatedAt).getTime() +
                              7 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        Request Refund
                      </button>
                    </div>
                  )} */}

                  {/* Address */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm border-t pt-3">
                    <MapPin size={14} className="text-green-500" />
                    <span>
                      {order.address?.street}, {order.address?.city},{" "}
                      {order.address?.state} - {order.address?.zip}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Policies */}
        <footer className="mt-10 text-center text-sm text-gray-500 space-x-4">
          <a href="/privacy" className="hover:text-blue-500">
            Privacy Policy
          </a>
          <a href="/returns" className="hover:text-blue-500">
            Return Policy
          </a>
          <a href="/terms" className="hover:text-blue-500">
            Terms of Use
          </a>
        </footer>
      </div>
    </div>
  );
};

export default MyOrders;
