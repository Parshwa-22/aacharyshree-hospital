import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./shared/components/ScrollToTop";
import { useEffect, useState } from "react";
import { fetchSiteSettings, openInauguration } from "./api/publicApi";
import CurtainOpening from "./components/opening/CurtainOpening";
import "./i18n";

function App() {
  const [openingStatus, setOpeningStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((settings) => {
      if (!cancelled) setOpeningStatus(settings?.openingStatus === "CLOSED" ? "CLOSED" : "OPEN");
    });
    return () => { cancelled = true; };
  }, []);

  const handleInaugurationOpen = async () => {
    const settings = await openInauguration();
    if (settings?.openingStatus !== "OPEN") throw new Error("The opening status could not be confirmed.");
  };

  if (openingStatus === null) {
    return <div className="min-h-screen bg-[#160305]" aria-label="Loading website" />;
  }

  return (
    <>
      <ScrollToTop />
      <div className="pt-20">
        <AppRoutes />
      </div>
      {openingStatus === "CLOSED" && <CurtainOpening onOpen={handleInaugurationOpen} onComplete={() => setOpeningStatus("OPEN")} />}
    </>
  );
}

export default App;
