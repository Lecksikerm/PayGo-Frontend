import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEye, FaEyeSlash, FaBell, FaWallet, FaMoneyBillWave,
  FaUserFriends, FaUserCircle, FaChartLine, FaClock,
  FaArrowUp, FaArrowDown, FaPlus, FaSignOutAlt,
  FaHome, FaExchangeAlt, FaHistory, FaCog
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);  // This controls all balance displays
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState([]);

  const token = localStorage.getItem("accessToken");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch wallet balance
        const walletRes = await axios.get(
          "https://paygo-backend-9srx.onrender.com/api/wallet/balance",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedBalance = walletRes.data.balance ?? 0;
        setBalance(fetchedBalance);

        // Fetch unread notification count
        try {
          const notifRes = await axios.get(
            "https://paygo-backend-9srx.onrender.com/api/notifications?unreadOnly=true&limit=1",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUnreadCount(notifRes.data.unreadCount || 0);
        } catch (notifError) {
          setUnreadCount(0);
        }

        // Fetch recent transactions
        try {
          const transactionsRes = await axios.get(
            "https://paygo-backend-9srx.onrender.com/api/transactions?limit=5",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRecentActivity(transactionsRes.data.transactions || []);
        } catch (transError) {
          setRecentActivity([]);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load some data");
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Helper function to format hidden balance
  const formatHiddenAmount = (amount) => {
    if (showBalance) {
      return `₦${amount.toLocaleString()}`;
    } else {
      return "••••••";
    }
  };

  // Helper function to format hidden number
  const formatHiddenNumber = (number) => {
    if (showBalance) {
      return number.toString();
    } else {
      return "••";
    }
  };

  const quickActions = [
    {
      name: "Fund Wallet",
      icon: FaWallet,
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      path: "/fund-wallet",
      description: "Add money to your wallet"
    },
    {
      name: "Transfer Funds",
      icon: FaExchangeAlt,
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      path: "/transfer",
      description: "Send money instantly"
    },
    {
      name: "Beneficiaries",
      icon: FaUserFriends,
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700",
      path: "/beneficiaries",
      description: "Manage your contacts"
    },
    {
      name: "Transactions",
      icon: FaHistory,
      color: "from-yellow-500 to-yellow-600",
      hoverColor: "from-yellow-600 to-yellow-700",
      path: "/transactions",
      description: "View transaction history"
    },
    {
      name: "Profile",
      icon: FaCog,
      color: "from-gray-500 to-gray-600",
      hoverColor: "from-gray-600 to-gray-700",
      path: "/profile",
      description: "Manage your account"
    },
    {
      name: "Notifications",
      icon: FaBell,
      color: "from-orange-500 to-orange-600",
      hoverColor: "from-orange-600 to-orange-700",
      path: "/notifications",
      description: "View alerts",
      badge: unreadCount > 0 ? unreadCount : null
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center px-8 py-4 shadow-lg bg-white/80 backdrop-blur-md border-b border-white/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PayGo
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {/* Time Display */}
          <div className="text-right hidden lg:block">
            <div className="text-lg font-bold text-gray-800">
              {currentTime.toLocaleTimeString('en-NG', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
            <div className="text-xs text-gray-500">
              {currentTime.toLocaleDateString('en-NG', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Enhanced Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/notifications")}
            className="relative p-3 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
          >
            <FaBell className="text-gray-600 text-xl group-hover:text-blue-600 transition-colors" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Enhanced User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <img
              src={user?.avatar || "https://www.gravatar.com/avatar/000?d=mp&f=y"}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md"
            />
            <div className="hidden md:block">
              <p className="font-bold text-gray-800">
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </p>
              <p className="text-xs text-gray-500">Verified User</p>
            </div>
          </div>

          {/* Enhanced Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your wallet today
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <FaHome className="text-gray-600" />
              <span className="text-gray-700">Landing</span>
            </button>
          </div>

          {/* Quick Stats Cards - NOW SYNCED WITH BALANCE HIDE/SHOW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 text-sm font-medium">+12.5%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  formatHiddenAmount(balance)  // This now respects showBalance state!
                )}
              </h3>
              <p className="text-gray-500 text-sm">Total Balance</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaClock className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-blue-600 text-sm font-medium">Today</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatHiddenNumber(5)}  {/* This also respects showBalance state! */}
              </h3>
              <p className="text-gray-500 text-sm">Transactions</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaUserFriends className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-purple-600 text-sm font-medium">Active</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatHiddenNumber(12)}  {/* This also respects showBalance state! */}
              </h3>
              <p className="text-gray-500 text-sm">Beneficiaries</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-2 opacity-20 blur-xl"></div>

          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-blue-100 text-sm mb-2">Available Balance</p>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-12 bg-white/20 rounded-lg animate-pulse"
                    />
                  ) : (
                    <motion.p
                      key="balance"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-bold"
                    >
                      {formatHiddenAmount(balance)}  {/* This now respects showBalance state! */}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="text-blue-100 text-sm mt-2">+₦5,230 today</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowBalance(!showBalance)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
              >
                {showBalance ? <FaEyeSlash className="w-6 h-6" /> : <FaEye className="w-6 h-6" />}
              </motion.button>
            </div>

            {/* Quick Actions in Card */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/fund-wallet")}
                className="bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-all duration-200 text-left group"
              >
                <FaPlus className="w-5 h-5 mb-2 group-hover:rotate-90 transition-transform" />
                <p className="text-sm font-medium">Add Funds</p>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/transfer")}
                className="bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-all duration-200 text-left group"
              >
                <FaArrowUp className="w-5 h-5 mb-2 group-hover:-translate-y-1 transition-transform" />
                <p className="text-sm font-medium">Send Money</p>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className={`relative bg-gradient-to-r ${action.color} hover:${action.hoverColor} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <action.icon className="w-8 h-8" />
                    {action.badge && (
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-lg mb-1">{action.name}</h4>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}



