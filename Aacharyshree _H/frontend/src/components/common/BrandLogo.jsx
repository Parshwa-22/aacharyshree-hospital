export default function BrandLogo({ className = "", alt = "Aacharyashree Hospital" }) {
  return <img src="/images/chikisalay-logo.png?v=pdf-1" alt={alt} width="254" height="258" className={`block h-full max-h-full w-full max-w-full object-contain ${className}`} />;
}
