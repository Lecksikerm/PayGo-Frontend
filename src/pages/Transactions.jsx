import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

export default function Transactions() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [type, setType] = useState("");
    const [sort, setSort] = useState("desc");
    const [totalPages, setTotalPages] = useState(1);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get("/wallet/transactions", {
                params: { page, limit: 10, type, sort },
            });

            setTransactions(res.data.transactions);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error loading transactions:", err);
            // Don't use alert - show user-friendly error
            setTransactions([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, type, sort]);

    // Helper to get display info
    const getTransactionInfo = (t) => {
        if (t.type === "credit" && t.senderInfo) {
            return {
                icon: <FiArrowDownLeft className="text-green-400" />,
                badgeColor: "bg-green-500/20 text-green-300 border border-green-500/30",
                label: "From",
                name: t.senderInfo.name,
                email: t.senderInfo.email
            };
        }
        if (t.type === "debit" && t.recipientInfo) {
            return {
                icon: <FiArrowUpRight className="text-red-400" />,
                badgeColor: "bg-red-500/20 text-red-300 border border-red-500/30",
                label: "To",
                name: t.recipientInfo.name,
                email: t.recipientInfo.email
            };
        }

        return {
            icon: t.type === "credit" ? <FiArrowDownLeft className="text-green-400" /> : <FiArrowUpRight className="text-red-400" />,
            badgeColor: t.type === "credit" ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30",
            label: "Reference",
            name: t.reference || "N/A",
            email: ""
        };
    };

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
                        <span>📊</span>
                        Transaction History
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
                                Transaction History
                            </h2>
                            <p className="text-purple-200">
                                View all your financial activities in one place
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Filters - Glass cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex gap-4"
                >
                    <div className="relative">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="appearance-none bg-white/10 border border-white/30 text-white p-3 pr-8 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        >
                            <option value="">All Types</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                        <span className="absolute right-2 top-3 text-purple-300 pointer-events-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>

                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none bg-white/10 border border-white/30 text-white p-3 pr-8 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                        <span className="absolute right-2 top-3 text-purple-300 pointer-events-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                </motion.div>

                {/* Transactions Table - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
                >
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-6 text-left text-sm font-semibold text-purple-300">Type</th>
                                <th className="p-6 text-left text-sm font-semibold text-purple-300">Amount</th>
                                <th className="p-6 text-left text-sm font-semibold text-purple-300">Details</th>
                                <th className="p-6 text-left text-sm font-semibold text-purple-300">Date</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mr-4"></div>
                                            <span className="text-purple-300">Loading transactions...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center">
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                                                <span className="text-purple-400 text-2xl">📊</span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-purple-300">No Transactions</h3>
                                            <p className="text-purple-200">Your transaction history will appear here</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <motion.tbody>
                                    {transactions.map((t) => {
                                        const info = getTransactionInfo(t);
                                        return (
                                            <motion.tr
                                                key={t._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="hover:bg-white/5 transition-colors cursor-pointer group"
                                                onClick={() => navigate(`/transactions/${t._id}`)}
                                            >
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${info.badgeColor.replace('text-', 'bg-opacity-20 bg-')}`}>
                                                            {info.icon}
                                                        </div>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${info.badgeColor}`}>
                                                            {t.type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`font-bold text-lg ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                                        {t.type === 'credit' ? '+' : '-'}₦{t.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <div>
                                                        <p className="text-xs text-purple-300 mb-1">{info.label}</p>
                                                        <p className="font-medium text-white">{info.name}</p>
                                                        {info.email && (
                                                            <p className="text-sm text-purple-400 truncate max-w-[200px]">{info.email}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="text-sm text-purple-300">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-purple-400">
                                                        {new Date(t.createdAt).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </motion.tbody>
                            )}
                        </tbody>
                    </table>
                </motion.div>

                {/* Pagination - Glass buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center items-center gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-6 py-3 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Prev
                    </motion.button>
                    <span className="px-6 py-3 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30 font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-6 py-3 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Next
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}

