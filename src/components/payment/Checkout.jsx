const handlePaymentSuccess = async (response, order) => {
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        address,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully!");
        window.location.href = "/my-orders";
      } else {
        toast.error("Failed to save order!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  