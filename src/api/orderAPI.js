export const getOrders = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/orders/my-orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
};
