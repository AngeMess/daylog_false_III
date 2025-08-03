const CardContent = ({ children, className = "" }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
);

export default CardContent;
// No se pasan props extraños al DOM, solo children y className. 