import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaArrowLeft,
    FaReceipt,
    FaDownload,
    FaShareAlt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle
} from "react-icons/fa";
import api from "../services/api";
import { toast } from "react-toastify";

export default function TransactionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactionDetails();
    }, [id]);

    const fetchTransactionDetails = async () => {
        try {
            setLoading(true);
            // Fetch specific transaction by ID
            const res = await api.get(`/wallet/transactions/${id}`);
            setTransaction(res.data.transaction);
        } catch (err) {
            console.error("Error fetching transaction:", err);
            toast.error("Transaction not found");
            navigate("/transactions");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Transaction Receipt',
                text: `₦${transaction.amount} ${transaction.type} on ${new Date(transaction.createdAt).toLocaleDateString()}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
            case 'completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'pending':
                return <FaClock className="text-amber-500" />;
            case 'failed':
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaCheckCircle className="text-green-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">Transaction Not Found</h2>
                    <button
                        onClick={() => navigate("/transactions")}
                        className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Back to History
                    </button>
                </div>
            </div>
        );
    }

    const isCredit = transaction.type === 'credit' || transaction.amount > 0;
    const date = new Date(transaction.createdAt);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/transactions")}
                        className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <h1 className="text-lg font-bold text-white">Transaction Details</h1>
                    <button
                        onClick={handleShare}
                        className="p-2 text-white hover:text-purple-300 transition-colors"
                    >
                        <FaShareAlt />
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                {/* Status Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 mb-6"
                >
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {getStatusIcon(transaction.status)}
                    </div>

                    <h2 className={`text-4xl font-bold mb-2 ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                        {isCredit ? '+' : '-'}₦{Math.abs(transaction.amount).toLocaleString()}
                    </h2>

                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                        {getStatusIcon(transaction.status)}
                        <span className="capitalize">{transaction.status || 'Completed'}</span>
                    </div>
                </motion.div>

                {/* Details Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
                >
                    <div className="p-6 space-y-6">
                        {/* Transaction ID */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-purple-300 mb-1">Transaction ID</p>
                                <p className="font-mono text-white text-sm break-all">{transaction._id}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(transaction._id);
                                    toast.success("ID copied");
                                }}
                                className="text-xs text-purple-400 hover:text-white transition-colors ml-4"
                            >
                                Copy
                            </button>
                        </div>

                        {/* Reference Number */}
                        <div>
                            <p className="text-sm text-purple-300 mb-1">Reference</p>
                            <p className="font-mono text-white">{transaction.reference}</p>
                        </div>

                        {/* Type */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-purple-300">Type</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${isCredit ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                }`}>
                                {transaction.type}
                            </span>
                        </div>

                        {/* From/To Details */}
                        {transaction.recipientInfo && (
                            <div>
                                <p className="text-sm text-purple-300 mb-2">Recipient</p>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <p className="font-semibold text-white">{transaction.recipientInfo.name}</p>
                                    <p className="text-sm text-purple-400">{transaction.recipientInfo.email}</p>
                                </div>
                            </div>
                        )}

                        {transaction.senderInfo && (
                            <div>
                                <p className="text-sm text-purple-300 mb-2">Sender</p>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <p className="font-semibold text-white">{transaction.senderInfo.name}</p>
                                    <p className="text-sm text-purple-400">{transaction.senderInfo.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Date */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <span className="text-sm text-purple-300">Date</span>
                            <div className="text-right">
                                <p className="text-white font-medium">
                                    {date.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-sm text-purple-400">
                                    {date.toLocaleTimeString('en-NG')}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => navigate("/receipt/view", { state: { transaction } })}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-lg transition-all"
                    >
                        <FaReceipt /> View Receipt
                    </button>

                    <button
                        onClick={() => navigate("/transactions")}
                        className="w-full py-4 bg-white/10 text-white rounded-2xl font-medium hover:bg-white/20 transition-colors"
                    >
                        Back to History
                    </button>
                </div>
            </main>
        </div>
    );
}


