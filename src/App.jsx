import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Landing from "./pages/Landing";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FundWallet from "./pages/FundWallet";
import SetPin from "./pages/wallet/SetPin";
import TransferFunds from "./pages/wallet/TransferFunds";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./pages/TransactionDetails";
import More from "./pages/More";
import VerifyFundingPage from "./pages/VerifyFundingPage";

export default function App() {
  useEffect(() => {
    fetch("https://paygo-backend-9srx.onrender.com/api/ping")
      .then(() => console.log("Backend awake"))
      .catch(() => console.log("Ping failed"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard & Authenticated Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/fund-wallet" element={<FundWallet />} />
        <Route path="/wallet/verify/:reference" element={<VerifyFundingPage />} />
        <Route path="/set-pin" element={<SetPin />} />
        <Route path="/transfer" element={<TransferFunds />} />

        {/* Password Recovery */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Transactions */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/:id" element={<TransactionDetails />} />

        {/* More */}
        <Route path="/more" element={<More />} />
      </Routes>
    </BrowserRouter>
  );
}





