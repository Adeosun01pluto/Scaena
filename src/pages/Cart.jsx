import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/Store.jsx";

const PLACEHOLDER = "https://via.placeholder.com/600x600?text=No+Image";

function CartItem({ item, onUpdateQuantity, onRemove, onOpenDetail }) {
  // Support images array + legacy fields
  const images = Array.isArray(item.images) ? item.images : [];
  const primaryImage =
    item.image ||
    item.imageUrl ||
    images[0] ||
    PLACEHOLDER;

  const price = Number(item.price ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-6 border-b border-neutral-500 py-6 md:grid-cols-[auto_1fr_auto_auto]"
    >
      {/* Clickable image + name area */}
      <div
        className="flex items-start gap-4 md:col-span-2 cursor-pointer"
        onClick={() => onOpenDetail(item)}
      >
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-white">
          <img
            src={primaryImage}
            alt={item.name || "Item"}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-base font-normal text-white">
            {item.name || "Untitled"}
          </h3>
          <p className="mt-1 text-sm text-white/70">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quantity + remove */}
      <div className="flex items-center justify-start md:justify-center">
        <div className="flex items-center gap-3 rounded-full border border-neutral-500 px-4 py-2">
          <button
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            className="text-white/70 hover:text-white"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="text-white/70 hover:text-white"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="ml-4 text-white/70 hover:text-white"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Line total */}
      <div className="flex items-center justify-end">
        <p className="text-base font-normal text-white">
          ${(price * item.quantity).toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const { state, updateQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();
  const cartItems = state.cart;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!state.isLoggedIn) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  // 🔗 Navigate to product detail when cart item clicked
  const handleOpenDetail = (item) => {
    const typeSlug =
      item.kind === "supply" ||
      item.type === "Supply" ||
      item.type === "supply"
        ? "supply"
        : "art";

    navigate(`/products/${typeSlug}/${item.id}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-600 flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-light">Your cart is empty</h2>
        <button
          onClick={() => navigate("/collections")}
          className="mt-8 bg-white px-8 py-3 text-sm text-neutral-900 hover:bg-white/90"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-600 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light mb-8">Your cart</h1>

        {/* Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 border-t border-neutral-500 pt-6">
          <div className="flex justify-between text-lg">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)} USD</p>
          </div>
          <p className="mt-2 text-sm text-white/70">
            Taxes and shipping calculated at checkout.
          </p>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg.white py-3 text-sm text-neutral-900 bg-white hover:bg-white/90"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
