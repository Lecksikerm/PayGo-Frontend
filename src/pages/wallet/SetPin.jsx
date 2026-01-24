import { useState } from "react";
import { setWalletPin } from "../../api/wallet.js";
import BackButton from "../../components/BackButton.jsx";
import { toast } from "react-toastify";

export default function SetPin() {
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSetPin = async () => {
        if (!/^\d{4}$/.test(pin)) {
            return toast.error("PIN must be exactly 4 digits");
        }

        setLoading(true);

        try {
            const res = await setWalletPin(pin);
            toast.success(res.data.message);
            setPin("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to set PIN");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <BackButton />

            <h2 className="text-2xl font-bold mb-4">Set Wallet PIN</h2>

            <input
                type="password"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                className="w-full p-3 border rounded mb-4"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
            />

            <button
                onClick={handleSetPin}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
                {loading ? "Saving..." : "Save PIN"}
            </button>
        </div>
    );
}

