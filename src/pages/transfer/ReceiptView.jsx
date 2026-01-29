import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaArrowLeft,
    FaDownload,
    FaCheckCircle,
    FaShareAlt,
    FaHistory,
    FaQrcode,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ReceiptView = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const transaction = state?.transaction || {};
    const newBalance = state?.newBalance ?? null;

    /* --------------------------------------------------
     * 1.  Redirect only AFTER first render if no data
     * -------------------------------------------------- */
    useEffect(() => {
        if (!transaction._id) {
            navigate("/transactions", { replace: true });
        }
    }, [transaction._id, navigate]);

    /* don’t render anything until we know if we have data */
    if (!transaction._id) return null;

    /* --------------------------------------------------
     * 2.  Pure helpers (unchanged)
     * -------------------------------------------------- */
    const formatAmount = (amt) => {
        if (amt == null) return "0.00";
        const n = Number(amt);
        return isNaN(n) ? "0.00" : n.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (d) => {
        if (!d) return { date: "N/A", time: "", short: "N/A" };
        const date = new Date(d);
        if (isNaN(date.getTime())) return { date: "Invalid Date", time: "", short: "Invalid Date" };
        return {
            date: date.toLocaleDateString("en-NG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            time: date.toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }),
            short: date.toLocaleDateString("en-NG", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        };
    };

    const amount = formatAmount(transaction.amount);
    const dateObj = formatDate(transaction.createdAt);
    const status = transaction.status || "completed";

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "PayGo Receipt",
                    text: `₦${amount} ${transaction.type || "transaction"} on ${dateObj.short}`,
                    url: window.location.href,
                });
            } catch (e) { /* user cancelled */ }
        } else {
            navigator.clipboard.writeText(
                `PayGo Receipt: ₦${amount} – ${transaction.reference || "N/A"}`
            );
        }
    };

    /* --------------------------------------------------
     * 3.  Render your gorgeous cosmic UI
     * -------------------------------------------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
            {/* animated background blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }} />
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ y: [-20, 20], opacity: [0, 1, 0] }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* header */}
            <div className="relative z-10 backdrop-blur-lg bg-white/10 border-b border-white/20">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link
                        to="/transactions"
                        className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20 text-white hover:bg-white/30 transition-all"
                    >
                        <FaArrowLeft /> Back to Transactions
                    </Link>
                    <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                        Receipt
                    </h1>
                    <div className="flex items-center gap-3">
                        <motion.button whileHover={{ scale: 1.05 }} onClick={handleShare} className="p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-all">
                            <FaShareAlt />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => window.print()} className="p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-all">
                            <FaDownload />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* main content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                    {/* success header */}
                    <div className="text-center mb-8 border-b border-white/20 pb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                            <FaCheckCircle className="text-white text-3xl" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2">Transaction Successful</h2>
                        <p className="text-white/60">Receipt for your records</p>
                    </div>

                    {/* amount */}
                    <div className="text-center mb-8 border-b border-white/20 pb-8">
                        <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-2">Amount</p>
                        <h3 className="text-5xl font-bold text-white mb-2">₦{amount}</h3>
                        <p className="text-white/60 text-sm">Nigerian Naira</p>
                        {newBalance != null && (
                            <p className="text-white/80 text-sm mt-2">New balance: ₦{formatAmount(newBalance)}</p>
                        )}
                    </div>

                    {/* details grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Transaction Details</h3>
                            <Row label="Reference" value={transaction.reference || transaction._id} />
                            <Row label="Date" value={dateObj.date} />
                            <Row label="Time" value={dateObj.time} />
                            <Row label="Status" value={status} valueColor="text-green-400" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Amount Details</h3>
                            <Row label="Amount" value={`₦${amount}`} />
                            <Row label="Type" value={transaction.type || "Transfer"} />
                            <Row label="Description" value={transaction.description || "Money Transfer"} />
                            {transaction.recipientEmail && (
                                <Row label="Recipient" value={transaction.recipientName || transaction.recipientEmail.split("@")[0]} />
                            )}
                        </div>
                    </div>

                    {/* QR placeholder */}
                    <div className="text-center mt-8 pt-6 border-t border-white/20">
                        <p className="text-white/60 text-sm mb-4">Scan to verify this transaction</p>
                        <div className="w-32 h-32 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center mx-auto">
                            <FaQrcode className="text-white/40 text-4xl" />
                        </div>
                    </div>

                    {/* footer actions */}
                    <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-white/20">
                        <Link
                            to="/transactions"
                            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                            <FaHistory /> View All Transactions
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
                        >
                            <FaDownload /> Download PDF
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

/* helper row */
const Row = ({ label, value, valueColor = "text-white" }) => (
    <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
        <span className="text-white/70">{label}</span>
        <span className={`font-semibold ${valueColor}`}>{value}</span>
    </div>
);

export default ReceiptView;