import { useState } from "react";
import { useStore } from "../../context/Store.jsx";
import { Trash2, Pencil } from "lucide-react";

export default function AdminUsers() {
  const { state, createUser, updateUser, deleteUser } = useStore();
  const [form, setForm] = useState({ id: "", name: "", email: "", role: "customer" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    if (form.id) updateUser(form);
    else createUser({ ...form, id: crypto.randomUUID() });
    setForm({ id: "", name: "", email: "", role: "customer" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Users</h1>

      <form onSubmit={submit} className="rounded-xl border bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Select label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })}
                  options={["admin","editor","customer"]} />
          <button className="mt-6 rounded-lg bg-stone-900 px-4 py-2 text-white hover:bg-stone-800">
            {form.id ? "Update" : "Create"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left">
            <tr><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Actions</Th></tr>
          </thead>
          <tbody>
            {state.users.map((u) => (
              <tr key={u.id} className="border-t">
                <Td>{u.name}</Td><Td>{u.email}</Td><Td>{u.role}</Td>
                <Td>
                  <button className="mr-2 rounded border px-2 py-1" onClick={() => setForm(u)}><Pencil size={14}/></button>
                  <button className="rounded border px-2 py-1 text-red-600" onClick={() => deleteUser(u.id)}><Trash2 size={14}/></button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type="text" }) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-stone-600">{label}</div>
      <input value={value} onChange={(e)=>onChange(e.target.value)}
             type={type} className="w-full rounded-lg border px-3 py-2" />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-stone-600">{label}</div>
      <select value={value} onChange={(e)=>onChange(e.target.value)}
              className="w-full rounded-lg border px-3 py-2">
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
const Th = ({ children }) => <th className="px-3 py-2 text-xs font-medium uppercase text-stone-500">{children}</th>;
const Td = ({ children }) => <td className="px-3 py-2">{children}</td>;
