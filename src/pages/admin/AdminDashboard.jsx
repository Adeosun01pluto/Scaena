import { useStore } from "../../context/Store.jsx";

export default function AdminDashboard() {
  const { state } = useStore();

  const cards = [
    { label: "Users",       value: state?.users?.length ?? 0 },
    { label: "Categories",  value: state?.categories?.length ?? 0 },
    { label: "Artworks",    value: state?.artworks?.length ?? 0 },
    { label: "Supplies",    value: state?.supplies?.length ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Overview</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-4">
            <div className="text-sm text-stone-500">{c.label}</div>
            <div className="mt-2 text-2xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-4 text-sm text-stone-600">
        Live data is streaming from Firestore. Make edits from the Admin sections to see counts update instantly.
      </div>
    </div>
  );
}
