import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getOrder } from '../services/stripeService';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const orderData = await getOrder(sessionId);
        setOrder(orderData);
        
        // Clear cart from localStorage
        localStorage.removeItem('cart');
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
        <p className="mt-4 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
          <p className="font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="bg-stone-900 text-stone-100 px-6 py-3 rounded hover:bg-stone-800 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center mb-8">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Payment Successful!
        </h1>
        <p className="text-green-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Order ID:</span>
              <span className="text-stone-600">{order.sessionId}</span>
            </div>
            
            {order.customerEmail && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Email:</span>
                <span className="text-stone-600">{order.customerEmail}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total Amount:</span>
              <span className="text-stone-600 font-semibold">
                ${order.amount.toFixed(2)} {order.currency.toUpperCase()}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Status:</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Shipping Address:</h3>
              <div className="bg-stone-50 p-4 rounded">
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postal_code}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {order.items && order.items.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Items:</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-stone-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${((item.amount_total || 0) / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <strong>What's next?</strong> You will receive a confirmation email
          shortly with your order details and tracking information once your
          order ships.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/profile')}
          className="flex-1 border border-stone-300 px-6 py-3 rounded hover:bg-stone-100 transition"
        >
          View Orders
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-stone-900 text-stone-100 px-6 py-3 rounded hover:bg-stone-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}