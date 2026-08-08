export default function BrandLogo({ className = "", alt = "Aacharyashree Hospital" }) {
  return <img src="/images/l1.png" alt={alt} className={`block max-h-full max-w-full object-contain ${className}`} />;
}
