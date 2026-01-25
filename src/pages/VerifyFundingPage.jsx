import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function VerifyFundingPage() {
    const { reference } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Verifying payment...");

    useEffect(() => {
        async function verify() {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/wallet/verify/${reference}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    }
                );

                setMessage(res.data.message || "Wallet funded successfully");
                toast.success(res.data.message || "Wallet funded successfully");

                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate("/dashboard");
                }, 3000);

            } catch (err) {
                console.error("Verification failed:", err.response?.data || err);
                setMessage(err.response?.data?.message || "Verification failed");
                toast.error(err.response?.data?.message || "Verification failed");

                // Optionally redirect back after failure
                setTimeout(() => {
                    navigate("/fund-wallet");
                }, 3000);
            } finally {
                setLoading(false);
            }
        }

        verify();
    }, [reference, navigate]);

    return (
        <div className="max-w-lg mx-auto mt-20 p-6 bg-white shadow rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Paystack Payment</h2>
            <p>{message}</p>
            {loading && <p className="mt-4 text-gray-500">Processing...</p>}
        </div>
    );
}

