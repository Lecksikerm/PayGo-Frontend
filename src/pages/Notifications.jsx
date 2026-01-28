import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTrash, FaBell, FaArrowLeft, FaInfoCircle } from "react-icons/fa"; // ✅ Added FaInfoCircle
import { motion, AnimatePresence } from "framer-motion";

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "credit":
                return (
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-400 text-xl">💰</span>
                    </div>
                );
            case "debit":
                return (
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-red-400 text-xl">💸</span>
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 text-xl">📢</span>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header - Dark gradient with purple accent */}
            <div className="bg-gradient-to-r from-slate-800 to-purple-900 shadow-lg border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white hover:text-purple-200"
                    >
                        <FaArrowLeft className="text-sm" />
                        Back to Dashboard
                    </motion.button>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                        <FaBell className="text-lg" />
                        Notifications
                    </h1>
                    <div className="w-20"></div>
                </div>
            </div>

            {/* Main Content - Glass morphism effect */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Page Header - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
                >
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Your Notifications
                            </h2>
                            <p className="text-purple-200">
                                Stay updated with your recent activities
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <div className="flex items-center gap-4">
                                <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm border border-purple-500/30">
                                    {unreadCount} unread
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={markAllAsRead}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium shadow-lg"
                                >
                                    <FaCheck className="inline mr-2" />
                                    Mark all as read
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Notifications List - Glass cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-4"
                >
                    {notifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center"
                        >
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaBell className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-purple-300 mb-2">No Notifications</h3>
                            <p className="text-purple-200">You're all caught up! Check back later for updates.</p>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {notifications.map((notif) => (
                                <motion.div
                                    key={notif._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`p-6 rounded-2xl border transition-all ${notif.read
                                            ? 'bg-white/5 border-white/10'
                                            : 'bg-purple-500/10 border-purple-500/30 shadow-lg'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {getIcon(notif.type)}
                                        <div className="flex-1">
                                            <h3 className={`font-semibold mb-1 ${notif.read ? 'text-purple-200' : 'text-white'
                                                }`}>
                                                {notif.title}
                                            </h3>
                                            <p className={`mb-2 ${notif.read ? 'text-purple-300' : 'text-purple-200'
                                                }`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-purple-400">
                                                {new Date(notif.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notif.read && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => markAsRead(notif._id)}
                                                className="p-3 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30 transition-all border border-green-500/30"
                                                title="Mark as read"
                                            >
                                                <FaCheck className="w-4 h-4" />
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </motion.div>

                {/* Info Card - Glass card */}
                {notifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <FaInfoCircle className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-purple-300">Notification Tips</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-purple-200 text-sm">
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                            <span>Green notifications indicate successful transactions</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                            <span>Red notifications indicate debits or issues</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                            <span>Click the check mark to mark notifications as read</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                            <span>Use "Mark all as read" to clear all at once</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
