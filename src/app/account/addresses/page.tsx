"use client";

import { useState } from "react";
import { useStore, type Address } from "@/lib/store";
import { EmptyState, Modal } from "@/components/ui";
import AddressForm from "@/components/account/AddressForm";

export default function AddressesPage() {
  const { addresses, saveAddress, deleteAddress, setDefaultAddress, toast, user } = useStore();
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <h1 className="text-xl font-black text-[#1a1a2e]">My Addresses</h1>
        <button onClick={() => setEditing("new")} className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-sm font-bold px-4 py-2 rounded-xl">+ Add New</button>
      </div>
      <div className="p-5 sm:p-6">
        {addresses.length === 0 ? (
          <EmptyState emoji="🏠" title="No saved addresses" text="Save an address for a faster checkout next time." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className={`rounded-2xl border-2 p-5 ${a.isDefault ? "border-[#e91e8c] bg-[#fff8fb]" : "border-gray-100"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{a.label === "Home" ? "🏠" : a.label === "Work" ? "🏢" : "📍"}</span>
                  <span className="font-black text-[#1a1a2e]">{a.label}</span>
                  {a.isDefault && <span className="text-[10px] font-bold bg-[#e91e8c] text-white px-2 py-0.5 rounded">Default</span>}
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <div className="font-bold text-[#1a1a2e]">{a.name}</div>
                  {a.line1}<br />{a.line2 ? `${a.line2}, ` : ""}{a.city} - {a.pincode}<br />{a.state}, India<br />Phone: {a.phone}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm font-bold">
                  <button onClick={() => setEditing(a)} className="text-[#1e88e5] hover:underline">Edit</button>
                  {!a.isDefault && <button onClick={() => { setDefaultAddress(a.id); toast("Default address updated"); }} className="text-[#e91e8c] hover:underline">Set as Default</button>}
                  <button onClick={() => { if (window.confirm("Delete this address?")) { deleteAddress(a.id); toast("Address deleted", "info"); } }} className="text-gray-400 hover:text-red-500 ml-auto">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Add New Address" : "Edit Address"} onClose={() => setEditing(null)}>
          <AddressForm
            initial={editing === "new" ? { name: user?.name ?? "", phone: user?.phone ?? "" } : editing}
            showDefault
            initialDefault={editing !== "new" && editing.isDefault}
            onCancel={() => setEditing(null)}
            onSubmit={(v, makeDefault) => {
              saveAddress({ ...v, id: editing === "new" ? undefined : editing.id, isDefault: makeDefault });
              toast(editing === "new" ? "Address added" : "Address updated");
              setEditing(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
