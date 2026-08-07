import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./shared/components/ScrollToTop";
import "./i18n";

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="pt-20">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
