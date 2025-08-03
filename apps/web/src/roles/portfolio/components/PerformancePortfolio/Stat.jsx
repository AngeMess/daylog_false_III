const Stat = ({ value, label, icon }) => (
  <div className="flex items-center gap-4">
    <div className="bg-gray-50 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <div className="text-4xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

export default Stat;
// No se pasan props extraños al DOM, solo value, label e icon. 