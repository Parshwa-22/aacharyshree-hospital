export default function BrandLogo({ className = "", alt = "Aacharyashree Hospital" }) {
  return <img src="/images/l1.png?v=48a9f2f" alt={alt} width="250" height="80" className={`block h-full max-h-full w-full max-w-full object-contain ${className}`} />;
}
