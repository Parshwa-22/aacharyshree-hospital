export default function BrandLogo({ className = "", alt = "Aacharyashree Hospital" }) {
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      <object data="/Chikisalay Logo.pdf#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf" aria-label={alt} className="pointer-events-none h-full w-full overflow-hidden object-contain">
        <img src="/images/l1.png" alt={alt} className="h-full w-full object-contain" />
      </object>
    </span>
  );
}
