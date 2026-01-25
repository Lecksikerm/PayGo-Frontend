import { useState, useEffect, useCallback } from "react";
import { fundWalletManual, verifyWalletPin } from "../api/wallet";
import BackButton from "../components/BackButton";
import axios from "axios";
import { toast } from "react-toastify";

export default function FundWallet() {
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY;

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (email) setUserEmail(email);
    }, []);

    const getAuthData = () => ({
        token: localStorage.getItem("accessToken"),
        email: userEmail || localStorage.getItem("userEmail")
    });

    const handleManualFunding = async () => {
        if (!amount || Number(amount) <= 0) {
            return toast.error("Enter a valid amount");
        }
        if (pin.length !== 4) {
            return toast.error("Enter your 4-digit PIN");
        }

        setLoading(true);
        try {
            await verifyWalletPin(pin);
            const res = await fundWalletManual(Number(amount), pin);
            setMessage(res.data.message);
            toast.success(res.data.message);
            setAmount("");
            setPin("");
        } catch (error) {
            const msg = error.response?.data?.message || "Manual funding failed";
            setMessage(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Use useCallback to prevent recreation
    const verifyPayment = useCallback(async (reference) => {
        const { token } = getAuthData();
        console.log("Verifying payment:", reference); // Debug log

        try {
            const verifyRes = await axios.get(
                `${API_BASE}/wallet/verify/${reference}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Verification response:", verifyRes.data); // Debug log

            // Show toast immediately
            toast.success(verifyRes.data.message || "Payment successful!");
            setMessage(verifyRes.data.message || "Wallet funded successfully");
            setAmount("");

        } catch (err) {
            console.error("Verification error:", err);
            const errorMsg = err.response?.data?.message || "Payment verification failed";
            toast.error(errorMsg);
            setMessage(errorMsg);
        } finally {
            setLoading(false); // Always stop loading
        }
    }, [API_BASE]); // Dependencies

    const handlePaystackFunding = async () => {
        if (!amount || Number(amount) <= 0) {
            return toast.error("Enter a valid amount");
        }
        if (Number(amount) < 100) {
            return toast.error("Minimum amount is ₦100");
        }

        const { token } = getAuthData();
        const email = userEmail || localStorage.getItem("userEmail");

        if (!token) {
            return toast.error("Please login to continue");
        }
        if (!email) {
            return toast.error("Please enter your email below");
        }

        if (!PAYSTACK_KEY) {
            console.error("Paystack key not configured");
            return toast.error("Payment system not configured");
        }

        if (typeof window.PaystackPop === 'undefined') {
            console.error("Paystack not loaded");
            return toast.error("Payment system loading... Please refresh and try again.");
        }

        setLoading(true);
        setMessage("Initializing payment...");

        try {
            const initRes = await axios.post(
                `${API_BASE}/wallet/fund/paystack`,
                { amount: Number(amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { reference } = initRes.data;

            if (!reference) {
                throw new Error("No reference returned from server");
            }

            console.log("Opening Paystack with reference:", reference); // Debug log

            const handler = window.PaystackPop.setup({
                key: PAYSTACK_KEY,
                email: email,
                amount: Number(amount) * 100,
                currency: "NGN",
                ref: reference,
                // Use arrow function to preserve context
                callback: (response) => {
                    console.log("Paystack callback received:", response); // Debug log

                    // Close the Paystack iframe first
                    // handler.closeIframe(); // Uncomment if needed

                    // Call verification immediately without setTimeout
                    verifyPayment(response.reference);
                },
                onClose: () => {
                    console.log("Paystack closed"); // Debug log
                    setLoading(false);
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
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-lg">
            <BackButton />
            <h2 className="text-2xl font-bold mb-4">Fund Wallet</h2>

            {message && (
                <p className={`p-2 mb-3 rounded ${message.includes("failed") || message.includes("error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                    }`}>
                    {message}
                </p>
            )}

            {!localStorage.getItem("userEmail") && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email (required for Paystack)</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 border rounded"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                <input
                    type="number"
                    placeholder="Enter amount (min ₦100)"
                    className="w-full p-3 border rounded"
                    value={amount}
                    min="100"
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">4-Digit PIN (for manual funding)</label>
                <input
                    type="password"
                    placeholder="Enter PIN"
                    maxLength={4}
                    inputMode="numeric"
                    pattern="\d{4}"
                    className="w-full p-3 border rounded"
                    value={pin}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) setPin(value);
                    }}
                    disabled={loading}
                />
            </div>

            <button
                onClick={handleManualFunding}
                className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 mb-3 transition-colors"
                disabled={loading || !amount || pin.length !== 4}
            >
                {loading ? "Processing..." : "Fund Manually (Dev Only)"}
            </button>

            <button
                onClick={handlePaystackFunding}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors"
                disabled={loading || !amount || (!localStorage.getItem("userEmail") && !userEmail)}
            >
                {loading ? "Please wait..." : "Fund with Paystack"}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
                Secure payment powered by Paystack
            </p>
        </div>
    );
}
