export default function BrandLogo({ className = "", alt = "Aacharyashree Hospital" }) {
  return (
    <object data="/Chikisalay Logo.pdf" type="application/pdf" aria-label={alt} className={`object-contain ${className}`}>
      <img src="/images/l1.png" alt={alt} className={`object-contain ${className}`} />
    </object>
  );
}
