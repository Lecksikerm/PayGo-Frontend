import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchWallet = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://paygo-bakend.onrender.com/api/wallet/balance",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBalance(res.data.balance);
      } catch (err) {
        console.error("Wallet fetch error:", err.response || err.message);
        toast.error(err.response?.data?.message || "Failed to fetch wallet balance");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 shadow-md bg-white rounded-b-lg">
        <h1 className="text-3xl font-bold text-blue-600">PayGo</h1>
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
          <span className="text-gray-700 font-medium">
            {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
          </span>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            onClick={() => {
              setUser(null);
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Back to Landing */}
      <div className="px-8 py-6">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
          onClick={() => navigate("/")}
        >
          ← Back to Landing
        </button>
      </div>

      {/* Wallet Balance */}
      <div className="px-8 pb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 flex items-center justify-between transition transform hover:scale-[1.01]">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Wallet Balance</h3>
            {loading ? (
              <p className="text-gray-400">Loading balance...</p>
            ) : (
              <p className="text-3xl font-bold text-green-600">
                {showBalance ? `₦${balance}` : "••••••"}
              </p>
            )}
          </div>
          <button
            className="text-gray-600 text-xl hover:text-gray-800 transition duration-300"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/fund-wallet")}
            className="bg-blue-600 text-white h-24 rounded-xl shadow-md hover:shadow-xl hover:bg-blue-700 flex items-center justify-center text-lg font-semibold transition duration-300 transform hover:-translate-y-1"
          >
            Fund Wallet
          </button>

          <button
            onClick={() => navigate("/transfer")}
            className="bg-green-600 text-white h-24 rounded-xl shadow-md hover:shadow-xl hover:bg-green-700 flex items-center justify-center text-lg font-semibold transition duration-300 transform hover:-translate-y-1"
          >
            Transfer Funds
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-600 text-white h-24 rounded-xl shadow-md hover:shadow-xl hover:bg-gray-700 flex items-center justify-center text-lg font-semibold transition duration-300 transform hover:-translate-y-1"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
