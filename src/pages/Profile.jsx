import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import {
    FaArrowLeft,
    FaCamera,
    FaUser,
    FaLock,
    FaTrash,
    FaCheck,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaSave,
    FaBell,
    FaShieldAlt,
    FaMoon,
    FaSun,
    FaAward,
} from "react-icons/fa";

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPage = location.state?.from || "/dashboard";

    const { user, setUser } = useContext(UserContext);
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [darkMode, setDarkMode] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const token = localStorage.getItem("accessToken");
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    // Example user stats
    const userStats = {
        totalTransactions: 156,
        totalSent: 1250000,
        totalReceived: 2100000,
        accountAge: "6 months",
        verifiedStatus: user?.isVerified || false,
        premiumLevel: "Gold",
        memberSince: new Date(user?.createdAt || Date.now()).toLocaleDateString(),
    };

    // Tabs
    const tabs = [
        { id: "profile", label: "Profile", icon: FaUser, color: "text-blue-500" },
        { id: "security", label: "Security", icon: FaShieldAlt, color: "text-green-500" },
        { id: "preferences", label: "Preferences", icon: FaBell, color: "text-purple-500" },
    ];

    // Fetch user profile
    useEffect(() => {
        if (!token) return navigate("/login");

        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    "https://paygo-backend-9srx.onrender.com/api/profile ",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAvatar(res.data.user.avatar || null);
                setUser(res.data.user);
                reset({
                    firstName: res.data.user.firstName,
                    lastName: res.data.user.lastName,
                    phone: res.data.user.phone || "",
                    address: res.data.user.address || "",
                });
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load profile");
            }
        };

        fetchProfile();
    }, [token, navigate, reset, setUser]);

    // Upload avatar
    const onUploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingAvatar(true);
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await axios.post(
                "https://paygo-backend-9srx.onrender.com/api/profile/avatar ",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
            toast.success(res.data.message);
            const updatedUser = { ...user, avatar: res.data.avatar };
            setUser(updatedUser);
            setAvatar(res.data.avatar);
        } catch (err) {
            toast.error(err.response?.data?.message || "Avatar upload failed");
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Update profile info
    const onUpdateProfile = async (data) => {
        try {
            setLoading(true);
            const res = await axios.put(
                "https://paygo-backend-9srx.onrender.com/api/profile ",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(res.data.message);
            setUser({ ...user, ...res.data.user });
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    // Change password
    const onChangePassword = async (data) => {
        const { currentPassword, newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await axios.put(
                "https://paygo-backend-9srx.onrender.com/api/profile/change-password ",
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Password changed successfully!");
            reset();
        } catch (err) {
            toast.error(err.response?.data?.message || "Change password failed");
        } finally {
            setLoading(false);
        }
    };

    // Delete account
    const onDeleteAccount = async () => {
        const password = prompt("Enter your password to delete your account:");
        if (!password) return;

        try {
            setLoading(true);
            await axios.delete(
                "https://paygo-backend-9srx.onrender.com/api/profile/delete ",
                { headers: { Authorization: `Bearer ${token}` }, data: { password } }
            );
            toast.success("Account deleted successfully");
            setUser(null);
            localStorage.clear();
            navigate("/register");
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete account failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header - Dark gradient with purple accent */}
            <div className="bg-gradient-to-r from-slate-800 to-purple-900 shadow-lg border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(previousPage)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white hover:text-purple-200"
                    >
                        <FaArrowLeft />
                        Back
                    </motion.button>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Profile Settings
                    </h1>
                    <div className="w-20"></div>
                </div>
            </div>

            {/* Main Content - Glass morphism effect */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Profile Header - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex gap-8 items-center border border-white/20"
                >
                    <div className="relative">
                        <img
                            src={avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y "}
                            alt="avatar"
                            className="w-32 h-32 rounded-full border-4 border-purple-400 shadow-lg object-cover"
                        />
                        <motion.label
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all"
                        >
                            <FaCamera className="text-white text-sm" />
                            <input type="file" accept="image/*" className="hidden" onChange={onUploadAvatar} />
                        </motion.label>
                        {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-purple-200">{user?.email}</p>
                        <div className="flex gap-3">
                            {userStats.verifiedStatus && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                                    <FaCheck className="text-xs" /> Verified
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm border border-yellow-500/30">
                                <FaAward className="text-xs" /> {userStats.premiumLevel} Member
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs - Glass morphism */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-2 flex gap-1 border border-white/20">
                    {tabs.map(tab => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                : "text-purple-200 hover:bg-white/10"
                                }`}
                        >
                            <tab.icon className="text-lg" /> {tab.label}
                        </motion.button>
                    ))}
                </div>

                {/* Tab Content - Glass cards */}
                <AnimatePresence mode="wait">
                    {activeTab === "profile" && (
                        <motion.form
                            onSubmit={handleSubmit(onUpdateProfile)}
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-purple-200">First Name</label>
                                    <input
                                        {...register("firstName", { required: "First name required" })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="First Name"
                                    />
                                    {errors.firstName && <p className="text-pink-400 text-sm mt-1">{errors.firstName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-purple-200">Last Name</label>
                                    <input
                                        {...register("lastName", { required: "Last name required" })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="Last Name"
                                    />
                                    {errors.lastName && <p className="text-pink-400 text-sm mt-1">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-purple-200">Phone</label>
                                <input
                                    {...register("phone")}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    placeholder="+234 800 000 0000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-purple-200">Address</label>
                                <textarea
                                    {...register("address")}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                                    rows="3"
                                    placeholder="Your address"
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all shadow-lg"
                                >
                                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
                        >
                            {/* Password */}
                            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-300">
                                    <FaLock className="text-green-400" /> Change Password
                                </h3>
                                <input {...register("currentPassword", { required: true })} type="password" placeholder="Current Password" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                <input {...register("newPassword", { required: true, minLength: 6 })} type="password" placeholder="New Password" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                <input {...register("confirmPassword", { required: true, validate: v => v === watch("newPassword") })} type="password" placeholder="Confirm Password" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                <div className="flex gap-4">
                                    <button type="submit" className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg">
                                        {loading ? "Updating..." : "Change Password"}
                                    </button>
                                    <button type="button" onClick={() => reset()} className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all border border-white/30">
                                        Cancel
                                    </button>
                                </div>
                            </form>

                            {/* Delete */}
                            <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30 space-y-3">
                                <h3 className="text-red-300 font-bold flex items-center gap-2">
                                    <FaTrash /> Delete Account
                                </h3>
                                <p className="text-red-200 text-sm">⚠️ This action cannot be undone.</p>
                                <button onClick={onDeleteAccount} className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-lg">
                                    {loading ? "Processing..." : "Delete Account"}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === "preferences" && (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
                        >
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-300">
                                <FaBell className="text-purple-400" /> Preferences
                            </h3>
                            {/* Dark Mode Toggle */}
                            <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20">
                                <div className="flex items-center gap-2 text-purple-200">
                                    {darkMode ? <FaMoon /> : <FaSun />} Dark Mode
                                </div>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`w-14 h-8 rounded-full p-1 transition-all ${darkMode ? "bg-purple-500" : "bg-white/20"}`}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${darkMode ? "translate-x-6" : ""}`}></div>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}



