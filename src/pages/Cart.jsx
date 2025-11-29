import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, MapPin } from "lucide-react";
import {getCart, removeCartItem, addToCart} from "../api/cartAPI";

const Cart = ({ setCartCount }) => {

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isLoading, setLoading] = useState(false);



    // ✅ Fetch cart data from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      const items = data.cart || data; 
      setCart(items);
      updateTotal(items);
      if (setCartCount) setCartCount(items.length);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };



  // ✅ Remove item from cart
  const handleRemove = async (id) => {
    try {
      await removeCartItem(id);
      window.dispatchEvent(new Event("cartUpdated"));
      const updatedCart = cart.filter((item) => item.product._id !== id);
      setCart(updatedCart);
      updateTotal(updatedCart);
      if (setCartCount) setCartCount(updatedCart.length);
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };


  // ✅ Calculate total
  const updateTotal = (items) => {
    const totalPrice = items.reduce(
      (sum, item) => sum + (item.product.price || 0) * (item.qty || 1),
      0
    );
    setTotal(totalPrice);
  };

  useEffect(() => {
    fetchCart();
  }, []);


  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  if (!cart|| cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
  const { name, phone, street, city, state, zip } = address;
  if (!name || !phone || !street || !city || !state || !zip) {
    alert("Please fill in all delivery details before placing your order.");
    return;
  }

  const orderData = {
    userId,
    items:cart.map(item =>({
      _id: item.product._id,
      name: item.product.name,
      qty: item.product.qty || 1,
      price: item.product.price,
    })),
    totalAmount: total,
    paymentId: 1  ,
    orderId: 1 ,
    address,
  };
  try{
  const res = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // only if using auth
    },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (res.ok) {
      alert("🎉 Order placed successfully!");

      setCart([]);

      setAddress({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
      });

      window.location.href = "/orders";
    } else {
      alert(data.message || "❌ Failed to place order.");
    }
  } catch (error) {
    console.error("❌ Error placing order:", error);
    alert("Something went wrong while placing your order.");
  }
};


  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!cart|| cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const { name, phone, street, city, state, zip } = address;
    if (!name || !phone || !street || !city || !state || !zip) {
      alert("Please fill in all address fields before checkout.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await response.json();
      
      const options = {
        key: "rzp_test_RaaIzYzXfR2Oh3",
        amount: order.amount,
        currency: order.currency,
        name: "ArtSpace",
        description: "Payment for your artworks",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;

            await fetch("http://localhost:5000/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                userId,
                items:cart.map(item =>({
                  _id: item.product._id,
                  name: item.product.name,
                  qty: item.product.qty || 1,
                  price: item.product.price,
                })),
                totalAmount: total,
                paymentId: 1  ,
                orderId: 1 ,
                address,
              }),
            });

            alert("🎉 Payment Successful!");
            setCart([]);

            setAddress({
              name: "",
              phone: "",
              street: "",
              city: "",
              state: "",
              zip: "",
            });

            window.location.href = "/orders";
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          name,
          contact: phone,
        },
        theme: { color: "#2b6cb0" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
          🛒 Your Shopping Bag
        </h2>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                Loading your cart...
              </div>
            ) :!cart || cart.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                Your cart is empty 😢
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-5 border-b border-gray-100 pb-5"
                  >
                    <img
                      src={item.product.images?.[0] || ""}
                      alt={item.name}
                      className="w-24 h-28 object-cover rounded-lg shadow-sm"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm md:text-lg text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm mt-1 line-clamp-2">
                        {item.product.description}
                      </p>
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="flex items-center gap-1 mt-2 text-red-500 text-xs md:text-sm hover:text-red-600 cursor-pointer transition"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm md:text-lg text-gray-800">
                        ₹{(parseFloat(item.product.price) * (item.product.qty || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Address + Order Summary */}
          <div className="w-full md:w-96 bg-white rounded-xl shadow-sm p-6 h-fit transition-all hover:shadow-md">
            <h3 className="flex items-center gap-2 font-semibold text-lg md:text-xl mb-3 text-gray-800">
              <MapPin className="text-sky-500" /> Delivery Details
            </h3>

            <form onSubmit={handleCheckout} className="space-y-3 mb-6">
              <input type="text" name="name" value={address.name} onChange={handleChange}
                placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded-md" required />
              <input type="tel" name="phone" value={address.phone} onChange={handleChange}
                placeholder="Phone Number" className="w-full p-2 border border-gray-300 rounded-md" required />
              <input type="text" name="street" value={address.street} onChange={handleChange}
                placeholder="Street Address" className="w-full p-2 border border-gray-300 rounded-md" required />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" name="city" value={address.city} onChange={handleChange}
                  placeholder="City" className="w-full p-2 border border-gray-300 rounded-md" required />
                <input type="text" name="state" value={address.state} onChange={handleChange}
                  placeholder="State" className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              <input type="text" name="zip" value={address.zip} onChange={handleChange}
                placeholder="ZIP Code" className="w-full p-2 border border-gray-300 rounded-md" required />
            </form>

            <h3 className="font-semibold text-md md:text-xl mb-5 text-gray-800">
              Order Summary
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Merchandise</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="border-t border-gray-200 my-3"></div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-[var(--blue-light)] to-sky-500 hover:opacity-100 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-transform duration-300 hover:scale-105 cursor-pointer"
             onClick={handleCheckout} > Proceed to Checkout </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
