import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import BackButton from "../components/BackButton.jsx";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const autoEmail = searchParams.get("email") || "";

    const [email, setEmail] = useState(autoEmail);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        if (!email || !otp || !newPassword) return toast.error("All fields are required");

        setLoading(true);
        try {
            const res = await axios.post(
                "https://paygo-backend-9srx.onrender.com/api/auth/reset-password",
                { email, otp, newPassword }
            );

            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
                <BackButton />

                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Reset Password
                </h2>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg outline-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">OTP Code</label>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg outline-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg outline-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

