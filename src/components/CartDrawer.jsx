import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "../context/Store.jsx";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const { state, addToCart, decQty, removeFromCart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { items, subtotal } = useMemo(() => {
    const items = state.cart;
    const subtotal = items.reduce((a, c) => a + c.price * c.qty, 0);
    return { items, subtotal };
  }, [state.cart]);

  const checkout = () => {
    // Guardrail: login required
    if (!state.isLoggedIn) {
      // send them to login with redirect back to /checkout
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
      onClose();
    } else {
      navigate("/checkout");
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Dim background */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={onClose} aria-label="Close cart">
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="h-[calc(100%-200px)] overflow-auto p-5">
          {items.length === 0 && (
            <p className="text-sm text-stone-600">Your cart is empty.</p>
          )}

          <ul className="space-y-4">
            {items.map((it) => (
              <li key={it.id} className="flex gap-3 rounded-lg border p-3">
                <img src={it.image} alt={it.name} className="h-16 w-20 rounded object-cover" />
                <div className="flex flex-1 flex-col">
                  <p className="text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-stone-600">${it.price.toFixed(2)} USD</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() => decQty(it.id)}
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{it.qty}</span>
                    <button
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() => addToCart(it)}
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      className="ml-auto rounded border px-2 py-1 text-xs text-red-600"
                      onClick={() => removeFromCart(it.id)}
                      aria-label="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="border-t p-5">
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)} USD</span>
          </div>
          <button
            onClick={checkout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800 active:scale-[.99]"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
          <p className="mt-2 text-center text-xs text-stone-500">
            Taxes & shipping calculated at checkout.
          </p>
        </div>
      </aside>
    </div>
  );
}
