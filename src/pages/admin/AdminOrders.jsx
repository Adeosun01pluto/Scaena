// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { RefreshCcw } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live subscription to all orders
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading orders:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const formatDate = (createdAt) => {
    if (!createdAt) return "N/A";

    const opts = { year: "numeric", month: "short", day: "numeric" };

    // Firestore Timestamp
    if (createdAt.toDate) {
      return createdAt.toDate().toLocaleDateString("en-US", opts);
    }

    // Serialized {_seconds, _nanoseconds} (if it ever comes that way)
    if (createdAt._seconds) {
      return new Date(createdAt._seconds * 1000).toLocaleDateString(
        "en-US",
        opts
      );
    }

    if (typeof createdAt === "string") {
      return new Date(createdAt).toLocaleDateString("en-US", opts);
    }

    return "N/A";
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return;
    setSavingId(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Error updating order status. Please try again.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
        <div className="text-xs text-stone-500">
          Total: <span className="font-medium">{orders.length}</span>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-stone-500">
            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-stone-500">
            No orders found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-left">
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Amount</Th>
                  <Th>Payment</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <Td>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          #{order.sessionId?.slice(-8) || order.id}
                        </span>
                        <span className="text-xs text-stone-500">
                          {order.id}
                        </span>
                      </div>
                    </Td>

                    <Td>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {order.customerEmail || "—"}
                        </span>
                        <span className="text-xs text-stone-500">
                          User: {order.userId || "guest"}
                        </span>
                      </div>
                    </Td>

                    <Td>
                      <span className="font-semibold">
                        ${Number(order.amount || 0).toFixed(2)}
                      </span>{" "}
                      <span className="text-xs text-stone-500 uppercase">
                        {order.currency || "usd"}
                      </span>
                    </Td>

                    <Td>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          order.paymentStatus === "paid" ||
                          order.paymentStatus === "succeeded" ||
                          order.paymentStatus === "paid_out"
                            ? "bg-green-100 text-green-700"
                            : order.paymentStatus === "unpaid"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {order.paymentStatus || "—"}
                      </span>
                    </Td>

                    <Td>
                      <select
                        value={order.status || "completed"}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="rounded-lg border px-2 py-1 text-xs"
                        disabled={savingId === order.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="shipped">Shipped</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </Td>

                    <Td>{formatDate(order.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const Th = ({ children }) => (
  <th className="px-3 py-2 text-xs font-medium uppercase text-stone-500">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-3 py-2 align-top">{children}</td>
);
