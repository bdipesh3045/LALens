import { Route, Routes } from "react-router-dom";
import ShellLayout from "./components/ShellLayout";
import FloatingAssistant from "./components/FloatingAssistant";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import Methodology from "./pages/Methodology";
import DataSources from "./pages/DataSources";
import Challenge from "./pages/Challenge";
import InvestmentIntake from "./pages/InvestmentIntake";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ShellLayout />}>
          <Route path="/platform" element={<Platform />} />
          <Route path="/invest" element={<InvestmentIntake />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/challenge" element={<Challenge />} />
        </Route>
      </Routes>
      <FloatingAssistant />
    </>
  );
}

export default App;
