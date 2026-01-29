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
            setTransactions([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, type, sort]);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-purple-900 shadow-lg border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                    >
                        <FaArrowLeft className="text-sm" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </motion.button>
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Transaction History
                    </h1>
                    <div className="w-20"></div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-3"
                >
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="bg-white/10 border border-white/30 text-white p-3 pr-8 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none"
                    >
                        <option value="">All Types</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-white/10 border border-white/30 text-white p-3 pr-8 rounded-lg focus:ring-2 focus:ring-purple-500 appearance-none"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </motion.div>

                {/* Transactions List - ALIGNED GRID LAYOUT */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                >
                    {/* Header Row - Define columns here */}
                    <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 border-b border-white/10 bg-white/5 text-sm font-semibold text-purple-300 uppercase tracking-wider">
                        <div className="col-span-4 sm:col-span-3">Type</div>
                        <div className="col-span-4 sm:col-span-3 text-right sm:text-left">Amount</div>
                        <div className="hidden sm:block sm:col-span-4">Details</div>
                        <div className="col-span-4 sm:col-span-2 text-right">Date</div>
                    </div>

                    {/* Body Rows - Match the exact same columns */}
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-purple-300">No transactions found</p>
                            </div>
                        ) : (
                            transactions.map((t, index) => {
                                const info = getTransactionInfo(t);
                                const date = new Date(t.createdAt);

                                return (
                                    <motion.div
                                        key={t._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => navigate(`/transactions/${t._id}`)}
                                        className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer items-center"
                                    >
                                        {/* Type - 4 cols mobile, 3 cols desktop */}
                                        <div className="col-span-4 sm:col-span-3 flex items-center gap-2 sm:gap-3">
                                            <div className={`p-2 rounded-full ${t.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                {info.icon}
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${info.badgeColor}`}>
                                                {t.type}
                                            </span>
                                        </div>

                                        {/* Amount - 4 cols mobile, 3 cols desktop */}
                                        <div className="col-span-4 sm:col-span-3 text-right sm:text-left">
                                            <span className={`font-bold text-base sm:text-lg ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                                {t.type === 'credit' ? '+' : '-'}₦{t.amount.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Details - hidden on mobile, 4 cols desktop */}
                                        <div className="hidden sm:block sm:col-span-4 min-w-0">
                                            <p className="text-xs text-purple-300 mb-0.5">{info.label}</p>
                                            <p className="font-medium text-white truncate">{info.name}</p>
                                            {info.email && (
                                                <p className="text-xs text-purple-400 truncate">{info.email}</p>
                                            )}
                                        </div>

                                        {/* Date - 4 cols mobile, 2 cols desktop */}
                                        <div className="col-span-4 sm:col-span-2 text-right">
                                            <p className="text-sm text-white">
                                                {date.toLocaleDateString('en-NG', { day: '2-digit', month: 'short' })}
                                            </p>
                                            <p className="text-xs text-purple-400">
                                                {date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 pt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-6 py-2 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-6 py-2 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
}