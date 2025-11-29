import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { API_URL } from "../../config.js";


const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    axios.get(`${API_URL}/api/admin/orders/${id}`).then(res => {
        setOrder(res.data.order)
    });
    
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });


  return (
    !order ? <p>Loading...</p> :
    <div className="p-6">
      <div ref={printRef} className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Order Receipt</h2>
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Name:</b> {order.address.name}</p>
        <p><b>Phone:</b> {order.address.phone}</p>
        <p><b>Address:</b> {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}</p>
        <p><b>Payment Status:</b> {order.paymentStatus}</p> 
        <hr className="my-3" />

        <h3 className="font-semibold mb-2">Items</h3>
        <ul>
          {order.items.map((item, i) => (
            <li key={i}>
              {item.name} — ₹{item.price} × {item.qty}
            </li>
          ))}
        </ul>

        <hr className="my-3" />
        <p><b>Total:</b> ₹{order.totalAmount}</p>
      </div>

      <button
        onClick={handlePrint}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Print Receipt
      </button>
    </div>
  );
};
export default OrderDetails;
