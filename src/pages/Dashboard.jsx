import { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye, FaEyeSlash, FaBell, FaWallet, FaMoneyBillWave,
  FaUserFriends, FaUserCircle, FaChartLine, FaClock,
  FaArrowUp, FaArrowDown, FaPlus, FaSignOutAlt,
  FaHome, FaExchangeAlt, FaHistory, FaCog, FaLock,
  FaArrowRight, FaUser, FaArrowUp as FaArrowUpAlt
} from "react-icons/fa";
import { setWalletPin, getPinStatus, changeWalletPin } from "../api/wallet.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState([]);
  const [transactionCount, setTransactionCount] = useState(5);
  const [beneficiaryCount, setBeneficiaryCount] = useState(12);

  // PIN Modal States
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinMode, setPinMode] = useState("set");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [password, setPassword] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [hasPin, setHasPin] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  // Update Time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check PIN Status
  useEffect(() => {
    const checkPinStatus = async () => {
      try {
        const res = await getPinStatus();
        setHasPin(res.data.hasPin);
      } catch (err) {
        console.error("Failed to check PIN status:", err);
      }
    };
    checkPinStatus();
  }, []);

  // Fetch Dashboard Data
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const walletRes = await axios.get(
          "https://paygo-backend-9srx.onrender.com/api/wallet/balance",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBalance(walletRes.data.balance ?? 0);

        const notifRes = await axios.get(
          "https://paygo-backend-9srx.onrender.com/api/notifications?unreadOnly=true&limit=1",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadCount(notifRes.data.unreadCount || 0);

        const transactionsRes = await axios.get(
          "https://paygo-backend-9srx.onrender.com/api/wallet/transactions?limit=5",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentActivity(transactionsRes.data.transactions || []);
        setTransactionCount(transactionsRes.data.transactions?.length || 0);

      } catch (err) {
        toast.error("Failed to load some data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Hide/Show Balance
  const formatHiddenAmount = useCallback((amount = balance) => {
    return showBalance ? `₦${Number(amount).toLocaleString()}` : "••••••";
  }, [showBalance, balance]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // PIN Submit Handler
  const handlePinSubmit = async () => {
    if (!/^\d{4}$/.test(pin)) return toast.error("PIN must be exactly 4 digits");
    if (pin !== confirmPin) return toast.error("PINs do not match");
    if (!password) return toast.error("Password is required");

    setPinLoading(true);
    try {
      const res =
        pinMode === "set"
          ? await setWalletPin(pin, password)
          : await changeWalletPin(pin, currentPin || null, !currentPin ? password : null);

      toast.success(res.data.message);
      setHasPin(true);
      setShowPinModal(false);
      resetPinForm();
    } catch {
      toast.error("PIN operation failed");
    } finally {
      setPinLoading(false);
    }
  };

  const resetPinForm = () => {
    setPin("");
    setConfirmPin("");
    setPassword("");
    setCurrentPin("");
  };

  const quickActions = [
    {
      label: "Fund Wallet",
      subtext: "Add money",
      icon: <FaPlus className="text-white text-xl" />,
      color: "from-blue-500 to-blue-600",
      onClick: () => navigate("/fund-wallet")
    },
    {
      label: "Transfer Funds",
      subtext: "Send money",
      icon: <FaExchangeAlt className="text-white text-xl" />,
      color: "from-emerald-500 to-emerald-600",
      onClick: () => navigate("/transfer")
    },
    {
      label: "Beneficiaries",
      subtext: "Manage contacts",
      icon: <FaUserFriends className="text-white text-xl" />,
      color: "from-purple-500 to-purple-600",
      onClick: () => navigate("/beneficiaries")
    },
    {
      label: "Transactions",
      subtext: "View history",
      icon: <FaHistory className="text-white text-xl" />,
      color: "from-amber-500 to-amber-600",
      onClick: () => navigate("/transactions")
    },
    {
      label: "Profile",
      subtext: "Your account",
      icon: <FaUser className="text-white text-xl" />,
      color: "from-slate-500 to-slate-600",
      onClick: () => navigate("/profile")
    },
    {
      label: hasPin ? "Change PIN" : "Set PIN",
      subtext: hasPin ? "Update PIN" : "Secure wallet",
      icon: <FaLock className="text-white text-xl" />,
      color: "from-orange-500 to-orange-600",
      onClick: () => {
        setPinMode(hasPin ? "change" : "set");
        setShowPinModal(true);
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* PIN MODAL - Fixed blinking by placing directly in render with AnimatePresence */}
      <AnimatePresence mode="wait">
        {showPinModal && (
          <motion.div
            key="pin-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setShowPinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaLock className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {pinMode === "set" ? "Set Wallet PIN" : "Change Wallet PIN"}
                </h3>
              </div>

              <div className="space-y-4">
                {pinMode === "change" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="0000"
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New PIN (4 digits)</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="0000"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="0000"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePinSubmit}
                  disabled={pinLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {pinLoading ? "Processing..." : "Submit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white px-6 py-4 shadow-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FaWallet className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PayGo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{formatTime()}</p>
              <p className="text-xs text-gray-500">{formatDate()}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/notifications")}
              className="relative p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaBell className="text-gray-600 text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user?.firstName || "User"}</p>
                <p className="text-xs text-green-500">Verified</p>
              </div>
              <div className="relative">
                <img
                  src={user?.avatar || "https://www.gravatar.com/avatar?d=mp"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* WELCOME SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-end"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.firstName || "Kareem"}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your wallet today</p>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            View Report
          </button>
        </motion.div>

        {/* STATS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <StatCard
            icon={<FaChartLine className="text-emerald-600" />}
            label="Total Balance"
            value={formatHiddenAmount()}
            subtext="+12.5% from last month"
            trend="up"
          />
          <StatCard
            icon={<FaExchangeAlt className="text-blue-600" />}
            label="Transactions"
            value={transactionCount.toString()}
            subtext="Today"
            trend="neutral"
          />
          <StatCard
            icon={<FaUserFriends className="text-purple-600" />}
            label="Beneficiaries"
            value={beneficiaryCount.toString()}
            subtext="Active"
            trend="neutral"
          />
        </motion.div>

        {/* MAIN BALANCE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          <div className="relative z-10 flex justify-between items-start mb-8">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-bold">{formatHiddenAmount()}</h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  {showBalance ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
                <FaArrowUp className="text-green-300" /> +₦5,230 today
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FaWallet className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/fund-wallet")}
              className="flex-1 sm:flex-none px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
            >
              <FaPlus /> Add Funds
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/transfer")}
              className="flex-1 sm:flex-none px-6 py-3 bg-white/20 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
            >
              <FaArrowUpAlt className="rotate-45" /> Send Money
            </motion.button>
          </div>
        </motion.div>

        {/* QUICK ACTIONS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={`p-5 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
                    {action.icon}
                  </div>
                  <p className="font-bold text-sm">{action.label}</p>
                  <p className="text-xs text-white/80 mt-1">{action.subtext}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* RECENT ACTIVITY - Only visible when balance is shown */}
        <AnimatePresence mode="wait">
          {showBalance && (
            <motion.div
              key="recent-activity"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                <button
                  onClick={() => navigate("/transactions")}
                  className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  View All <FaArrowRight className="text-xs" />
                </button>
              </div>

              {recentActivity.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FaHistory className="mx-auto text-3xl mb-3 text-gray-300" />
                  <p>No recent transactions</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentActivity.map((t, index) => (
                    <motion.div
                      key={t._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate("/transactions")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'credit' || t.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                          {t.type === 'credit' || t.amount > 0 ? <FaArrowDown /> : <FaArrowUp />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">{t.type || "Transaction"}</p>
                          <p className="text-xs text-gray-500">{t.date || new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${t.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                        {t.amount < 0 ? "-" : "+"}{formatHiddenAmount(Math.abs(t.amount))}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-around py-3">
            <BottomButton
              icon={<FaHome />}
              label="Home"
              active={true}
              onClick={() => navigate("/")}
            />
            <BottomButton
              icon={<FaExchangeAlt />}
              label="Transfer"
              onClick={() => navigate("/transfer")}
            />
            <BottomButton
              icon={<FaLock />}
              label={hasPin ? "Change PIN" : "Set PIN"}
              onClick={() => {
                setPinMode(hasPin ? "change" : "set");
                setShowPinModal(true);
              }}
            />
            <BottomButton
              icon={<FaCog />}
              label="Settings"
              onClick={() => {
                // Check if settings page exists, if not show toast
                toast.info("Settings page coming soon!");
                // Or navigate: navigate("/settings");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* REUSABLE COMPONENTS */
function StatCard({ icon, label, value, subtext, trend }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-gray-400'}`}>
          {subtext}
        </p>
      </div>
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  );
}

function BottomButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${active
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

