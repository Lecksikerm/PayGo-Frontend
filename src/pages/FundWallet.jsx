import { useState } from "react";
import { fundWalletManual, fundWalletPaystack, verifyWalletPin } from "../api/wallet";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";

export default function FundWallet() {
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleManualFunding = async () => {
        if (!amount) return toast.error("Enter amount");
        if (pin.length !== 4) return toast.error("Enter your 4-digit PIN");

        setLoading(true);

        try {
            // Step 1: Verify PIN
            await verifyWalletPin(pin);

            // Step 2: Fund manually
            const res = await fundWalletManual(Number(amount), pin);

            setMessage(res.data.message);
            toast.success(res.data.message);

            setAmount("");
            setPin("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed");
            toast.error(error.response?.data?.message || "Failed");
        }

        setLoading(false);
    };

    const handlePaystackFunding = async () => {
        if (!amount) return toast.error("Enter amount");

        setLoading(true);

        try {
            const res = await fundWalletPaystack(Number(amount));

            // Redirect to Paystack payment page
            window.location.href = res.data.authorization_url;
        } catch (error) {
            setMessage(error.response?.data?.message || "Paystack Error");
            toast.error(error.response?.data?.message || "Paystack Error");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-lg">
            <BackButton />

            <h2 className="text-2xl font-bold mb-4">Fund Wallet</h2>

            {message && (
                <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">
                    {message}
                </p>
            )}

            {/* Amount Input */}
            <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-3 border rounded mb-4"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            {/* PIN Input */}
            <input
                type="password"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="w-full p-3 border rounded mb-4"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />

            {/* Manual Funding */}
            <button
                onClick={handleManualFunding}
                className="w-full bg-gray-700 text-white py-3 rounded hover:bg-gray-800 mb-3"
                disabled={loading}
            >
                {loading ? "Processing..." : "Fund Manually (PIN)"}
            </button>

            {/* Paystack Funding */}
            <button
                onClick={handlePaystackFunding}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
                disabled={loading}
            >
                {loading ? "Redirecting..." : "Fund With Paystack"}
            </button>
        </div>
    );
}
