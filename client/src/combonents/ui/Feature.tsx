function Feature({ Icon, title, desc }: { Icon: any; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition">
      <div className="w-12 h-12 rounded-full bg-[#4f772d] flex items-center justify-center text-white mb-4">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  )
}
export default Feature