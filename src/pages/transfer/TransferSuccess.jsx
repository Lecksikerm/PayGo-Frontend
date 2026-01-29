import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaCheckCircle,
    FaReceipt,
    FaHome,
    FaShareAlt,
    FaDownload,
    FaArrowRight,
    FaCalendarAlt,
    FaUser,
    FaMoneyBillWave,
    FaHashtag,
    FaCircle
} from "react-icons/fa";
import { useEffect, useState } from "react";

const TransferSuccess = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!state?.transaction) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full"
                >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCircle className="text-red-500 text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Transaction Found</h2>
                    <p className="text-gray-500 mb-6">We couldn't find the transaction details.</p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    const { transaction, newBalance } = state;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Transfer Receipt',
                    text: `I sent ₦${transaction.amount} to ${transaction.recipientEmail}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`Transfer of ₦${transaction.amount} to ${transaction.recipientEmail} - Ref: ${transaction.reference}`);
            // You'd need toast notification here
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-NG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('en-NG', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        };
    };

    const dateObj = formatDate(transaction.createdAt);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-24 relative overflow-hidden">
            {/* Confetti Animation Placeholder */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                y: -100,
                                x: Math.random() * window.innerWidth,
                                rotate: 0
                            }}
                            animate={{
                                y: window.innerHeight + 100,
                                rotate: 360,
                                x: Math.random() * window.innerWidth
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                ease: "linear",
                                delay: Math.random() * 2
                            }}
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)]
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Success Header */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-sm sticky top-0 z-40"
            >
                <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaHome className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Transfer Complete</h1>
                    <button
                        onClick={handleShare}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaShareAlt className="text-gray-600" />
                    </button>
                </div>
            </motion.div>

            <main className="max-w-lg mx-auto px-6 pt-8">
                {/* Success Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6"
                >
                    {/* Green Success Header */}
                    <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                        </div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10"
                        >
                            <FaCheckCircle className="text-4xl text-emerald-500" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold mb-1 relative z-10"
                        >
                            Transfer Successful!
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-emerald-50 text-sm relative z-10"
                        >
                            Your transaction has been completed
                        </motion.p>
                    </div>

                    {/* Amount Display */}
                    <div className="p-8 text-center border-b border-gray-100">
                        <p className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-wider">Amount Sent</p>
                        <motion.h3
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="text-4xl font-bold text-gray-800 mb-2"
                        >
                            ₦{Number(transaction.amount).toLocaleString()}
                        </motion.h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                            <FaCheckCircle className="text-xs" />
                            Completed
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-6 space-y-4">
                        <DetailRow
                            icon={<FaUser className="text-gray-400" />}
                            label="Recipient"
                            value={transaction.recipientEmail}
                            delay={0.6}
                        />
                        <DetailRow
                            icon={<FaHashtag className="text-gray-400" />}
                            label="Transaction Reference"
                            value={transaction.reference}
                            isMono={true}
                            delay={0.7}
                        />
                        <DetailRow
                            icon={<FaCalendarAlt className="text-gray-400" />}
                            label="Date & Time"
                            value={`${dateObj.date} • ${dateObj.time}`}
                            delay={0.8}
                        />
                        <DetailRow
                            icon={<FaMoneyBillWave className="text-gray-400" />}
                            label="New Balance"
                            value={`₦${Number(newBalance).toLocaleString()}`}
                            highlight={true}
                            delay={0.9}
                        />
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="space-y-3"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/receipt/view", { state: transaction })}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
                    >
                        <FaReceipt />
                        View Receipt
                        <FaArrowRight className="text-sm" />
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleShare}
                            className="py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                            <FaShareAlt />
                            Share
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/transfer")}
                            className="py-4 bg-blue-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                        >
                            <FaMoneyBillWave />
                            Send Again
                        </motion.button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-4 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                    >
                        Back to Dashboard
                    </motion.button>
                </motion.div>

                {/* Security Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8 text-center"
                >
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Secured by PayGo
                    </div>
                    <p className="text-xs text-gray-400">
                        Transaction ID: {transaction._id?.slice(-8) || 'N/A'}
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

// Detail Row Component
const DetailRow = ({ icon, label, value, isMono = false, highlight = false, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
    >
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
            <p className={`text-sm font-semibold text-gray-800 truncate ${isMono ? 'font-mono' : ''} ${highlight ? 'text-blue-600 text-lg' : ''}`}>
                {value}
            </p>
        </div>
    </motion.div>
);

export default TransferSuccess;
