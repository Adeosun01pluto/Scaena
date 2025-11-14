import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../services/stripeService';
import { auth } from '../lib/firebase';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      navigate('/cart');
    }

    // Get current user
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [navigate]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format items for Stripe
      // const items = cart.map(item => ({
      //   name: item.name || item.title,
      //   description: item.description || '',
      //   price: item.price,
      //   quantity: item.quantity,
      //   image: item.image || item.images?.[0],
      // }));

      const items = cart.map(item => ({
        name: item.name || item.title,
        // only send description if it exists & non-empty
        ...(item.description && item.description.trim() !== ''
          ? { description: item.description.trim() }
          : {}),
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.images?.[0],
      }));

      // Create checkout session and redirect
      await createCheckoutSession(items, user?.uid);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout');
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/supplies')}
          className="bg-stone-900 text-stone-100 px-6 py-3 rounded hover:bg-stone-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-4 mb-6">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center gap-4 pb-4 border-b">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name || item.title}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name || item.title}</h3>
                <p className="text-stone-600 text-sm">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-lg">
            <span>Subtotal:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>Shipping:</span>
            <span>Calculated at next step</span>
          </div>
          <div className="flex justify-between text-2xl font-bold pt-2 border-t">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <strong>Note:</strong> You will be redirected to Stripe's secure
          checkout page to complete your payment.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/cart')}
          className="flex-1 border border-stone-300 px-6 py-3 rounded hover:bg-stone-100 transition"
          disabled={loading}
        >
          Back to Cart
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex-1 bg-stone-900 text-stone-100 px-6 py-3 rounded hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
}