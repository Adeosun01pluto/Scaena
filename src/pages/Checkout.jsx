import Container from "../components/UI/Container.jsx";
import { useStore } from "../context/Store.jsx";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { state, clearCart } = useStore();
  const navigate = useNavigate();

  // Guardrail: kick to login if not authenticated
  useEffect(() => {
    if (!state.isLoggedIn) {
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`, { replace: true });
    }
  }, [state.isLoggedIn, navigate]);

  const { items, subtotal } = useMemo(() => {
    const items = state.cart;
    const subtotal = items.reduce((a, c) => a + c.price * c.qty, 0);
    return { items, subtotal };
  }, [state.cart]);

  if (!state.isLoggedIn) return null; // brief blank during redirect

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {items.length === 0 ? (
        <p className="mt-4 text-stone-600">Your cart is empty.</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 rounded-lg border bg-white p-3">
                <img src={it.image} alt={it.name} className="h-16 w-20 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-stone-600">Qty: {it.qty}</p>
                </div>
                <div className="text-sm font-medium">${(it.price * it.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <aside className="h-max rounded-lg border bg-white p-4">
            <h2 className="mb-3 font-medium">Order Summary</h2>
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)} USD</span>
            </div>
            <button
              className="mt-4 w-full rounded-lg bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800"
              onClick={() => {
                alert("Order placed! (demo)");
                clearCart();
                navigate("/");
              }}
            >
              Place Order
            </button>
          </aside>
        </div>
      )}
    </Container>
  );
}
