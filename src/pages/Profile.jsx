import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import {
    FaArrowLeft, FaCamera, FaUser, FaLock, FaTrash,
    FaCheck, FaSave, FaBell, FaShieldAlt, FaMoon, FaSun, FaAward
} from "react-icons/fa";

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPage = location.state?.from || "/dashboard";

    const { user, setUser } = useContext(UserContext);
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [darkMode, setDarkMode] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const token = localStorage.getItem("accessToken");
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    // Initialize avatar from context
    useEffect(() => {
        if (user?.avatar) {
            setAvatar(user.avatar);
        }
    }, [user]);

    // Fetch profile on mount to ensure fresh data
    useEffect(() => {
        if (!token) return navigate("/login");

        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    "https://paygo-backend-9srx.onrender.com/api/profile",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data.user) {
                    // Update both local state and context
                    setAvatar(res.data.user.avatar || null);
                    setUser(prev => ({ ...prev, ...res.data.user }));

                    reset({
                        firstName: res.data.user.firstName || "",
                        lastName: res.data.user.lastName || "",
                        phone: res.data.user.phone || "",
                        address: res.data.user.address || "",
                    });
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
                toast.error("Failed to load profile data");
            }
        };

        fetchProfile();
    }, [token, navigate, reset, setUser]);

    // Upload avatar
    const onUploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        setUploadingAvatar(true);
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await axios.post(
                "https://paygo-backend-9srx.onrender.com/api/profile/avatar",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success("Avatar updated successfully!");

            // IMPORTANT: Update both local state and global context
            const newAvatar = res.data.avatar;
            setAvatar(newAvatar);
            setUser(prev => ({ ...prev, avatar: newAvatar }));

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
                "https://paygo-backend-9srx.onrender.com/api/profile",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Profile updated successfully!");

            // Update context with new user data
            setUser(prev => ({ ...prev, ...res.data.user }));

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
                "https://paygo-backend-9srx.onrender.com/api/profile/change-password",
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Password changed successfully!");
            reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
                "https://paygo-backend-9srx.onrender.com/api/profile/delete",
                { headers: { Authorization: `Bearer ${token}` }, data: { password } }
            );
            toast.success("Account deleted");
            setUser(null);
            localStorage.clear();
            navigate("/register");
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-purple-900 shadow-lg border-b border-purple-500/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(previousPage)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Profile Settings
                    </h1>
                    <div className="w-20"></div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Profile Header */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row gap-6 items-center border border-white/20">
                    <div className="relative">
                        <img
                            src={avatar || "https://www.gravatar.com/avatar?d=mp"}
                            alt="avatar"
                            className="w-24 h-24 rounded-full border-4 border-purple-400 shadow-lg object-cover bg-gray-700"
                            onError={(e) => {
                                e.target.src = "https://www.gravatar.com/avatar?d=mp";
                            }}
                        />
                        <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                            <FaCamera className="text-white text-sm" />
                            <input type="file" accept="image/*" className="hidden" onChange={onUploadAvatar} />
                        </label>
                        {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-purple-200 text-sm">{user?.email}</p>
                        <div className="flex gap-2 mt-2 justify-center sm:justify-start">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
                                <FaCheck className="text-xs" /> Verified
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-1 flex gap-1 border border-white/20">
                    {[
                        { id: "profile", label: "Profile", icon: FaUser },
                        { id: "security", label: "Security", icon: FaShieldAlt },
                        { id: "preferences", label: "Preferences", icon: FaBell }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                    : "text-purple-200 hover:bg-white/10"
                                }`}
                        >
                            <tab.icon /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === "profile" && (
                        <motion.form
                            key="profile"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handleSubmit(onUpdateProfile)}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-4 border border-white/20"
                        >
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-purple-200 mb-1">First Name</label>
                                    <input
                                        {...register("firstName", { required: true })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-purple-200 mb-1">Last Name</label>
                                    <input
                                        {...register("lastName", { required: true })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-purple-200 mb-1">Phone</label>
                                <input
                                    {...register("phone")}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="+234..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-purple-200 mb-1">Address</label>
                                <textarea
                                    {...register("address")}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-purple-500 resize-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {activeTab === "security" && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-6 border border-white/20"
                        >
                            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-purple-300">
                                    <FaLock className="text-green-400" /> Change Password
                                </h3>
                                <input {...register("currentPassword")} type="password" placeholder="Current Password" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white" />
                                <input {...register("newPassword")} type="password" placeholder="New Password (min 6 chars)" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white" />
                                <input {...register("confirmPassword")} type="password" placeholder="Confirm Password" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white" />
                                <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                                    Change Password
                                </button>
                            </form>

                            <div className="pt-6 border-t border-white/10">
                                <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                                    <h3 className="text-red-300 font-bold flex items-center gap-2 mb-2">
                                        <FaTrash /> Delete Account
                                    </h3>
                                    <p className="text-red-200 text-sm mb-3">This cannot be undone.</p>
                                    <button onClick={onDeleteAccount} disabled={loading} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "preferences" && (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
                        >
                            <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                                <div className="flex items-center gap-2 text-purple-200">
                                    {darkMode ? <FaMoon /> : <FaSun />} Dark Mode
                                </div>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`w-12 h-6 rounded-full p-1 transition-all ${darkMode ? "bg-purple-500" : "bg-white/20"}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : ""}`}></div>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}