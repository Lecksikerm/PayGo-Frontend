import { useState, useCallback, useRef } from "react";
import { fundWalletPaystack } from "../api/wallet";
import BackButton from "../components/BackButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function FundWallet() {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const isProcessing = useRef(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_KEY;

    const getToken = () => localStorage.getItem("accessToken");

    const verifyPayment = useCallback(async (reference) => {
        const token = getToken();

        try {
            const verifyRes = await axios.get(
                `${API_BASE}/wallet/verify/${reference}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(verifyRes.data.message || "Payment successful!");
            setMessage("Payment successful! Redirecting to dashboard...");
            setAmount("");

            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

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
        setMessage("Initializing payment...");

        try {
            const initRes = await fundWalletPaystack(Number(amount));
            const { reference, authorization_url, email } = initRes.data;

            if (!reference) {
                throw new Error("No reference returned from server");
            }

            // ✅ Use email from API response, not req.user
            const handler = window.PaystackPop.setup({
                key: PAYSTACK_KEY,
                email: email, // ✅ Fixed: use email from backend response
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

    const handleGoToDashboard = () => {
        navigate("/dashboard");
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

            <button
                onClick={handlePaystackFunding}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={loading || !amount}
            >
                {loading ? "Processing..." : "Fund with Paystack"}
            </button>

            {message.includes("successful") && (
                <button
                    onClick={handleGoToDashboard}
                    className="w-full mt-3 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
                >
                    Go to Dashboard Now
                </button>
            )}

            <p className="text-xs text-gray-500 mt-4 text-center">
                Secure payment powered by Paystack
            </p>
        </div>
    );
}