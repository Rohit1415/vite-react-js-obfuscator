import { useEffect, useState } from "react";
import { api } from "../utils/api";

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-3">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order History</h1>
        <p className="text-gray-500 font-medium">Review your past purchases and track current shipments.</p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="card-premium p-12 text-center text-gray-500 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p>You haven't made any purchases yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card-premium overflow-hidden border border-gray-100/50 hover:border-gray-200/80">
              <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="font-black text-brand-600 text-lg">${order.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'shipped' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                  }`}>
                    • {order.status}
                  </span>
                  <span className="text-sm font-medium text-gray-400 font-mono">#{order.id.split('-')[1]}</span>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 font-bold">{item.productId.slice(-1)}</span>
                        </div>
                        <span className="text-gray-700">Product ID: {item.productId} <span className="text-gray-400 mx-2">x</span> {item.quantity}</span>
                      </div>
                      <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
