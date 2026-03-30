import { useEffect, useState } from "react";
import { api } from "../utils/api";

type CartItem = {
  productId: string;
  quantity: number;
};

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const carts = await api.getCart();
        if (carts && carts.length > 0) {
          setItems(carts[0].items || []);
        }
      } catch (err) {
        console.error("Failed to fetch cart", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
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
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900">Your Cart</h1>
        <p className="text-gray-500 font-medium">Review your items before checkout.</p>
      </div>

      <div className="card-premium p-8">
        {items.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛒</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
            <p className="text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="flex items-center space-x-4">
                   <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                     <span className="text-xl font-black text-brand-500">{item.productId.slice(-1)}</span>
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900">Product ID: {item.productId}</h4>
                     <p className="text-sm font-medium text-gray-500">Qty: {item.quantity}</p>
                   </div>
                </div>
                <div className="text-lg font-black text-gray-900 font-mono">
                  $---
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-gray-100 flex justify-between items-center mt-6">
              <span className="text-lg font-bold text-gray-500">Total</span>
              <span className="text-2xl font-black text-gray-900">$---</span>
            </div>

            <button className="btn-primary w-full mt-4">
               Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
