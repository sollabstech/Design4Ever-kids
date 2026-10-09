export function Avatar({ name, avatar, size = 72 }: { name: string; avatar?: string; size?: number }) {
  return (
    <div className="rounded-full bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0] border-4 border-white shadow-md flex items-center justify-center shrink-0 font-black text-[#e91e8c]"
      style={{ width: size, height: size, fontSize: avatar ? size * 0.5 : size * 0.38 }}>
      {avatar ?? name.charAt(0).toUpperCase()}
    </div>
  );
}
