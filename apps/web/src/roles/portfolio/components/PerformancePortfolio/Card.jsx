const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

export default Card;
// No se pasan props extraños al DOM, solo children y className. 