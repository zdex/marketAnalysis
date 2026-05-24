import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageShell from "./components/layout/PageShell";
import DashboardHome   from "./pages/DashboardHome";
import MacroDashboard  from "./pages/MacroDashboard";
import SectorDashboard from "./pages/SectorDashboard";
import StockDetail     from "./pages/StockDetail";
import Watchlists      from "./pages/Watchlists";
import Portfolio       from "./pages/Portfolio";
import Reports         from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/macro"     element={<MacroDashboard />} />
          <Route path="/sectors"   element={<SectorDashboard />} />
          <Route path="/stocks/:ticker" element={<StockDetail />} />
          <Route path="/watchlists" element={<Watchlists />} />
          <Route path="/portfolio"  element={<Portfolio />} />
          <Route path="/reports"    element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
