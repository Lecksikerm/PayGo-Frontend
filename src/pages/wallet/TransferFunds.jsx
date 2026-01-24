import { useState } from "react";
import { transferFunds } from "../../api/wallet.js";
import BackButton from "../../components/BackButton.jsx";
import { toast } from "react-toastify";

export default function TransferFunds() {
    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (!recipientEmail || !amount || !pin) {
            return toast.error("All fields are required");
        }

        if (!/^\d{4}$/.test(pin)) {
            return toast.error("PIN must be exactly 4 digits");
        }

        setLoading(true);

        try {
            const res = await transferFunds(recipientEmail, Number(amount), pin);
            toast.success(res.data.message);

            setRecipientEmail("");
            setAmount("");
            setPin("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Transfer failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
            <BackButton />

            <h2 className="text-2xl font-bold mb-4">Transfer Funds</h2>

            <input
                type="email"
                placeholder="Recipient Email"
                className="w-full p-3 border rounded mb-4"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
            />

            <input
                type="number"
                placeholder="Amount"
                className="w-full p-3 border rounded mb-4"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <input
                type="password"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="w-full p-3 border rounded mb-4"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />

            <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send Money"}
            </button>
        </div>
    );
}


