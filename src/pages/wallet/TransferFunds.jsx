import { useState } from "react";
import { transferFunds } from "../../api/wallet.js";
import BackButton from "../../components/BackButton.jsx";
import { SavedBeneficiaries } from "../../components/SavedBeneficiaries.jsx";
import { useBeneficiaries } from "../../hooks/useBeneficiaries.js";
import { toast } from "react-toastify";
import api from "../../services/api.js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Add this import

export default function TransferFunds() {
    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    // Verification states
    const [verifying, setVerifying] = useState(false);
    const [recipientInfo, setRecipientInfo] = useState(null);
    const [verified, setVerified] = useState(false);
    const [verificationError, setVerificationError] = useState("");

    const navigate = useNavigate(); // ✅ Add this hook
    const { refetch } = useBeneficiaries();

    // Verify recipient exists
    const verifyRecipient = async () => {
        if (!recipientEmail) {
            return toast.error("Please enter recipient email");
        }

        setVerifying(true);
        setVerificationError("");
        setRecipientInfo(null);
        setVerified(false);

        try {
            const res = await api.post("/auth/verify-user", { email: recipientEmail });

            if (res.data.exists) {
                setRecipientInfo(res.data.user);
                setVerified(true);
                toast.success(`Verified: ${res.data.user.firstName} ${res.data.user.lastName}`);
            } else {
                setVerificationError("User not found. Please check the email address.");
                toast.error("Recipient not found");
            }
        } catch (err) {
            console.error("Verification error:", err);
            setVerificationError("Unable to verify recipient.");
            toast.error("Verification failed");
        } finally {
            setVerifying(false);
        }
    };

    // Reset verification when email changes
    const handleEmailChange = (e) => {
        setRecipientEmail(e.target.value);
        if (verified) {
            setVerified(false);
            setRecipientInfo(null);
            setVerificationError("");
        }
    };

    // Auto-verify when selecting from beneficiaries
    const handleSelectBeneficiary = (beneficiary) => {
        setRecipientEmail(beneficiary.recipientEmail);
        setRecipientInfo({
            firstName: beneficiary.recipientName.split(' ')[0],
            lastName: beneficiary.recipientName.split(' ').slice(1).join(' ') || '',
            email: beneficiary.recipientEmail
        });
        setVerified(true);
        setVerificationError("");
        toast.info(`Selected: ${beneficiary.nickname || beneficiary.recipientName}`);
    };

    const handleTransfer = async () => {
        if (!verified || !recipientInfo) {
            return toast.error("Please verify recipient email first");
        }

        if (!amount || parseFloat(amount) <= 0) {
            return toast.error("Please enter a valid amount");
        }

        if (!pin || !/^\d{4}$/.test(pin)) {
            return toast.error("PIN must be exactly 4 digits");
        }

        setLoading(true);

        try {
            const res = await transferFunds(recipientEmail, Number(amount), pin);

            toast.success(res.data.message);

            navigate("/transfer/success", {
                state: {
                    transaction: res.data.transaction,
                    newBalance: res.data.newBalance
                }
            });

            setTimeout(() => refetch(), 1000);

        } catch (err) {
            toast.error(err.response?.data?.message || "Transfer failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header - Dark gradient with purple accent */}
            <div className="bg-gradient-to-r from-slate-800 to-purple-900 shadow-lg border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* ✅ Fixed BackButton with proper navigation */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white hover:text-purple-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </motion.button>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Transfer Funds
                    </h1>
                    <div className="w-20"></div>
                </div>
            </div>

            {/* Rest of your component remains exactly the same... */}
            {/* Main Content - Glass morphism effect */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Transfer Header - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
                >
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Send Money Securely
                        </h2>
                        <p className="text-purple-200">
                            Transfer funds to verified recipients with confidence
                        </p>
                    </div>
                </motion.div>

                {/* Saved Beneficiaries - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
                >
                    <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        Saved Recipients
                    </h3>
                    <SavedBeneficiaries
                        onSelect={handleSelectBeneficiary}
                        selectedEmail={recipientEmail}
                    />
                </motion.div>

                {/* Transfer Form - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
                >
                    <div className="space-y-6">
                        {/* Recipient Verification */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-purple-300 mb-3">
                                Recipient Details
                            </label>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="email"
                                            placeholder="recipient@example.com"
                                            className={`w-full p-4 rounded-lg bg-white/10 border transition-all ${verified ? 'border-green-500/50 bg-green-500/10' :
                                                verificationError ? 'border-red-500/50 bg-red-500/10' :
                                                    'border-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'
                                                } text-white placeholder-purple-300`}
                                            value={recipientEmail}
                                            onChange={handleEmailChange}
                                            disabled={loading}
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={verifyRecipient}
                                        disabled={verifying || !recipientEmail || loading}
                                        className={`px-6 py-4 rounded-lg font-medium text-sm border transition-all ${verified
                                            ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                            : 'bg-purple-500/20 text-purple-300 border-purple-500/50 hover:bg-purple-500/30'
                                            }`}
                                    >
                                        {verifying ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                Verifying...
                                            </div>
                                        ) : verified ? (
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Verified
                                            </div>
                                        ) : "Verify"}
                                    </motion.button>
                                </div>

                                {verificationError && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {verificationError}
                                    </div>
                                )}

                                {verified && recipientInfo && (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">
                                                    {recipientInfo.firstName} {recipientInfo.lastName}
                                                </p>
                                                <p className="text-green-400 font-medium flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Verified PayGo User
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-purple-300">
                                    Amount (₦)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 font-medium">₦</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={loading || !verified}
                                        min="1"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* PIN */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-purple-300">
                                    Wallet PIN
                                </label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="••••"
                                    maxLength={4}
                                    className="w-full p-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-center text-2xl tracking-widest"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    disabled={loading || !verified}
                                />
                            </div>

                            {/* Transfer Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleTransfer}
                                disabled={loading || !verified || !amount || !pin}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : !verified ? (
                                    "Verify Recipient First"
                                ) : (
                                    `Send ₦${amount || '0'} to ${recipientInfo?.firstName || ''}`
                                )}
                            </motion.button>

                            {!verified && (
                                <p className="text-center text-purple-300 text-sm">
                                    Please verify recipient before proceeding with the transfer
                                </p>
                            )}
                        </div>

                        {/* Security Notice - Glass card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
                        >
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-purple-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-purple-300 font-medium">Security Notice</p>
                                    <p className="text-purple-200 text-sm mt-1">
                                        Always verify recipient details before confirming. Transactions cannot be reversed once completed.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}



