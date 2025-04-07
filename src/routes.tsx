import { Route, Routes } from "react-router-dom";
import PersonalLandingPage from "./pages/PersonalLandingPage.tsx";
import FinancialToolsPage from "./pages/FinancialToolsPage.tsx";
import SalesPriceCalculatorPage from "./pages/SalesPriceCalculatorPage.tsx";
import BreakEvenCalculatorPage from "./pages/BreakEvenCalculatorPage.tsx";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<PersonalLandingPage />} />
    <Route path="/financial-tools" element={<FinancialToolsPage />} />
    <Route
      path="/sales-price-calculator"
      element={<SalesPriceCalculatorPage />}
    />
    <Route
      path="/break-even-calculator"
      element={<BreakEvenCalculatorPage />}
    />
  </Routes>
);

export default AppRoutes;
