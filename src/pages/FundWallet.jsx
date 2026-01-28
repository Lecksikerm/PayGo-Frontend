import { useState, useCallback, useRef, useEffect } from "react";
import { fundWalletPaystack } from "../api/wallet";
import BackButton from "../components/BackButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    FaWallet, FaMoneyBillWave, FaRocket, FaCheckCircle,
    FaArrowRight, FaShieldAlt, FaLock, FaStar,
    FaCircle, FaArrowUp, FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function FundWallet() {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const isProcessing = useRef(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY;

    // Quick amount options
    const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000, 50000];

    // Simplified floating elements
    const floatingElements = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        size: Math.random() * 60 + 40,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 3,
        x: Math.random() * 100,
        y: Math.random() * 100,
    }));

    const getToken = () => localStorage.getItem("accessToken");

    const verifyPayment = useCallback(async (reference) => {
        const token = getToken();

        try {
            const verifyRes = await axios.get(
                `${API_BASE}/wallet/verify/${reference}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(verifyRes.data.message || "Payment successful!");
            setShowSuccess(true);
            setMessage("Payment successful! Your wallet has been funded.");
            setAmount("");
            setSelectedAmount(null);

            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);

        } catch (err) {
            console.error("Verification error:", err);
            const errorMsg = err.response?.data?.message || "Payment verification failed";
            toast.error(errorMsg);
            setMessage(errorMsg);
            isProcessing.current = false;
        } finally {
            setLoading(false);
        }
    }, [API_BASE, navigate]);

    const handleAmountSelect = (selectedAmt) => {
        setSelectedAmount(selectedAmt);
        setAmount(selectedAmt.toString());
    };

    const handleCustomAmount = (e) => {
        const value = e.target.value;
        setAmount(value);
        setSelectedAmount(value ? parseInt(value) || 0 : null);
    };

    const handlePaystackFunding = async () => {
        if (isProcessing.current) {
            console.log("Already processing, ignoring click");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            return toast.error("Enter a valid amount");
        }
        if (Number(amount) < 100) {
            return toast.error("Minimum amount is ₦100");
        }

        const token = getToken();
        if (!token) {
            return toast.error("Please login to continue");
        }

        if (!PAYSTACK_KEY) {
            return toast.error("Payment system not configured");
        }

        if (typeof window.PaystackPop === 'undefined') {
            return toast.error("Payment system loading... Please refresh and try again.");
        }

        isProcessing.current = true;
        setLoading(true);
        setMessage("Preparing your payment experience...");

        try {
            const initRes = await fundWalletPaystack(Number(amount));
            const { reference, authorization_url, email } = initRes.data;

            if (!reference) {
                throw new Error("No reference returned from server");
            }

            const handler = window.PaystackPop.setup({
                key: PAYSTACK_KEY,
                email: email,
                amount: Number(amount) * 100,
                currency: "NGN",
                ref: reference,
                callback: (response) => {
                    console.log("Paystack callback:", response);
                    verifyPayment(response.reference);
                },
                onClose: () => {
                    console.log("Paystack closed");
                    setLoading(false);
                    isProcessing.current = false;
                    setMessage("");
                    toast.info("Payment window closed");
                }
            });

            handler.openIframe();

        } catch (error) {
            console.error("Paystack funding error:", error);
            const errorMsg = error.response?.data?.message
                || error.message
                || "Failed to initialize payment";
            toast.error(errorMsg);
            setMessage(errorMsg);
            setLoading(false);
            isProcessing.current = false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
            {/* Animated Background Elements - Fixed version */}
            <div className="absolute inset-0">
                {floatingElements.map((element) => (
                    <motion.div
                        key={element.id}
                        className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                        style={{
                            width: element.size,
                            height: element.size,
                            left: `${element.x}%`,
                            top: `${element.y}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 20, 0],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: element.duration,
                            repeat: Infinity,
                            delay: element.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <BackButton />
                    <div className="text-center mt-8">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"
                        >
                            Fund Your Wallet
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-white/80 max-w-2xl mx-auto"
                        >
                            Power up your PayGo wallet with instant funding
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Side - Amount Selection */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-8"
                    >
                        {/* Amount Selection Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                    <FaMoneyBillWave className="text-yellow-400 text-2xl" />
                                </motion.div>
                                Choose Your Amount
                            </motion.h2>

                            {/* Quick Amount Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="grid grid-cols-2 gap-4 mb-8"
                            >
                                {quickAmounts.map((quickAmt, index) => (
                                    <motion.button
                                        key={quickAmt}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 + (index * 0.1) }}
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor: selectedAmount === quickAmt ? "#fbbf24" : "#ffffff",
                                            color: selectedAmount === quickAmt ? "#000000" : "#ffffff"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAmountSelect(quickAmt)}
                                        className={`p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 font-bold text-lg relative overflow-hidden ${selectedAmount === quickAmt
                                                ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/50"
                                                : "bg-white/20 text-white border-white/30 hover:border-white/50"
                                            }`}
                                    >
                                        {selectedAmount === quickAmt && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute inset-0 bg-yellow-400/20 rounded-2xl"
                                            />
                                        )}
                                        <span className="relative z-10">₦{quickAmt.toLocaleString()}</span>
                                    </motion.button>
                                ))}
                            </motion.div>

                            {/* Custom Amount Input */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="mb-6"
                            >
                                <label className="block text-sm font-medium text-white/80 mb-3">
                                    Or enter a custom amount
                                </label>
                                <div className="relative">
                                    <motion.span
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-white/60"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        ₦
                                    </motion.span>
                                    <motion.input
                                        whileFocus={{ scale: 1.02 }}
                                        type="number"
                                        placeholder="Enter amount (min ₦100)"
                                        className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white text-xl font-bold placeholder-white/50 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
                                        value={amount}
                                        min="100"
                                        onChange={handleCustomAmount}
                                        disabled={loading}
                                    />
                                </div>
                                {amount && Number(amount) < 100 && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-sm mt-3 flex items-center gap-2"
                                    >
                                        <motion.span
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        >
                                            ⚡
                                        </motion.span>
                                        Minimum amount is ₦100
                                    </motion.p>
                                )}
                            </motion.div>
                        </div>

                        {/* Payment Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
                        >
                            <motion.button
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.3)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePaystackFunding}
                                disabled={loading || !amount || Number(amount) < 100}
                                className={`w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-4 ${loading || !amount || Number(amount) < 100
                                        ? "bg-white/20 text-white/50 cursor-not-allowed backdrop-blur-sm"
                                        : "bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-black shadow-2xl hover:shadow-yellow-400/50 backdrop-blur-sm"
                                    }`}
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"></div>
                                        Preparing Payment...
                                    </motion.div>
                                ) : (
                                    <>
                                        <motion.span
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            
                                        </motion.span>
                                        {amount ? `Fund ₦${Number(amount).toLocaleString()}` : "Enter Amount"}
                                        <FaArrowRight className="text-xl" />
                                    </>
                                )}
                            </motion.button>

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-4 p-4 rounded-2xl text-center font-medium ${message.includes("failed") || message.includes("error")
                                            ? "bg-red-500/20 border border-red-500/50 text-red-300"
                                            : message.includes("successful")
                                                ? "bg-green-500/20 border border-green-500/50 text-green-300"
                                                : "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                                        }`}
                                >
                                    {message}
                                </motion.div>
                            )}

                            {showSuccess && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="mt-4 bg-gradient-to-r from-green-400 to-emerald-400 text-black py-3 rounded-2xl text-center font-bold"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <FaCheckCircle />
                                        Success! Redirecting...
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Features & Security */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Security Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-6 border border-green-400/30"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <FaShieldAlt className="text-green-400 text-2xl" />
                                </motion.div>
                                <h3 className="text-lg font-bold text-white">Bank-Grade Security</h3>
                            </div>
                            <p className="text-white/80 text-sm">
                                Your payment is protected with military-grade encryption and secure processing.
                            </p>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20"
                        >
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FaStar className="text-yellow-400" />
                                Why Choose PayGo?
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { icon: "⚡", text: "Lightning-fast funding" },
                                    { icon: "🛡️", text: "Military-grade security" },
                                    { icon: "🔄", text: "Instant wallet credit" },
                                    { icon: "📱", text: "Works on any device" }
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.0 + (index * 0.1) }}
                                        className="flex items-center gap-3 text-white/80"
                                    >
                                        <span className="text-lg">{feature.icon}</span>
                                        <span className="text-sm">{feature.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Payment Partners */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10"
                        >
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FaLock className="text-blue-400" />
                                Powered by Paystack
                            </h3>
                            <p className="text-white/70 text-sm">
                                Secure payment processing by Africa's leading payment platform
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Floating particles for extra flair */}
            <div className="fixed inset-0 pointer-events-none">
                {Array.from({ length: 20 }, (_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, 20],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}