/**
 * Combina nombres de clase usando clsx
 * @param {string[]} inputs - Clases CSS a combinar
 */
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export { cn };
