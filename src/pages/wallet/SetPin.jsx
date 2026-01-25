import { useState, useEffect } from "react";
import { setWalletPin, getPinStatus, changeWalletPin } from "../../api/wallet.js";
import BackButton from "../../components/BackButton.jsx";
import { toast } from "react-toastify";

export default function SetPin() {
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [password, setPassword] = useState("");
    const [currentPin, setCurrentPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [hasPin, setHasPin] = useState(false);
    const [showChangeForm, setShowChangeForm] = useState(false);

    // Check PIN status on mount
    useEffect(() => {
        checkPinStatus();
    }, []);

    const checkPinStatus = async () => {
        try {
            const res = await getPinStatus();
            setHasPin(res.data.hasPin);
        } catch (err) {
            toast.error("Failed to check PIN status");
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleSetPin = async () => {
        // Validation
        if (!/^\d{4}$/.test(pin)) {
            return toast.error("PIN must be exactly 4 digits");
        }
        if (pin !== confirmPin) {
            return toast.error("PINs do not match");
        }
        if (!password) {
            return toast.error("Password is required to set PIN");
        }

        setLoading(true);

        try {
            const res = await setWalletPin(pin, password);
            toast.success(res.data.message);
            // Reset form
            setPin("");
            setConfirmPin("");
            setPassword("");
            setHasPin(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to set PIN");
        }

        setLoading(false);
    };

    const handleChangePin = async () => {
        // Validation
        if (!/^\d{4}$/.test(pin)) {
            return toast.error("New PIN must be exactly 4 digits");
        }
        if (pin !== confirmPin) {
            return toast.error("PINs do not match");
        }

        setLoading(true);

        try {
            // Use current PIN if provided, otherwise use password
            const res = await changeWalletPin(
                pin,
                currentPin || null,
                !currentPin ? password : null
            );
            toast.success(res.data.message);
            // Reset form
            setPin("");
            setConfirmPin("");
            setCurrentPin("");
            setPassword("");
            setShowChangeForm(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change PIN");
        }

        setLoading(false);
    };

    if (checkingStatus) {
        return (
            <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
                <p className="text-center">Loading...</p>
            </div>
        );
    }

    // Show message if PIN already set and not in change mode
    if (hasPin && !showChangeForm) {
        return (
            <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
                <BackButton />

                <div className="text-center">
                    <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">PIN Already Set</h2>
                    <p className="text-gray-600 mb-6">
                        Your wallet PIN is already configured. You can change it if needed.
                    </p>
                    <button
                        onClick={() => setShowChangeForm(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                    >
                        Change PIN
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <BackButton />

            <h2 className="text-2xl font-bold mb-4">
                {showChangeForm ? "Change Wallet PIN" : "Set Wallet PIN"}
            </h2>

            {/* Current PIN input (only for change mode) */}
            {showChangeForm && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current PIN (or use password below)
                    </label>
                    <input
                        type="password"
                        maxLength={4}
                        placeholder="Enter current 4-digit PIN"
                        className="w-full p-3 border rounded"
                        value={currentPin}
                        onChange={(e) => setCurrentPin(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        OR enter your account password below instead
                    </p>
                </div>
            )}

            {/* New PIN input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {showChangeForm ? "New PIN" : "PIN"}
                </label>
                <input
                    type="password"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    className="w-full p-3 border rounded"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                />
            </div>

            {/* Confirm PIN input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm PIN
                </label>
                <input
                    type="password"
                    maxLength={4}
                    placeholder="Confirm 4-digit PIN"
                    className="w-full p-3 border rounded"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                />
            </div>

            {/* Password input (required for set, optional for change) */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Password
                    {!showChangeForm && <span className="text-red-500">*</span>}
                </label>
                <input
                    type="password"
                    placeholder="Enter your account password"
                    className="w-full p-3 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {showChangeForm
                        ? "Required if not providing current PIN"
                        : "Required to verify your identity"}
                </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
                {showChangeForm && (
                    <button
                        onClick={() => {
                            setShowChangeForm(false);
                            setPin("");
                            setConfirmPin("");
                            setCurrentPin("");
                            setPassword("");
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={showChangeForm ? handleChangePin : handleSetPin}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading
                        ? (showChangeForm ? "Changing..." : "Saving...")
                        : (showChangeForm ? "Change PIN" : "Save PIN")}
                </button>
            </div>

            {/* Security note */}
            <p className="text-xs text-gray-500 mt-4 text-center">
                Your PIN is encrypted and secure. Never share it with anyone.
            </p>
        </div>
    );
}