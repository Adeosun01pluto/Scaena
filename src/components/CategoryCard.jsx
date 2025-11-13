import { ArrowRight } from "lucide-react";

export default function CategoryCard({ cat }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md">
      <div className="aspect-[1/.8] w-full overflow-hidden rounded-xl bg-stone-100">
        <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-medium">{cat.name}</p>
        <ArrowRight className="opacity-70" size={18} />
      </div>
    </div>
  );
}
