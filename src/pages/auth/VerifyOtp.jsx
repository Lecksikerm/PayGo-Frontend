import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!email) {
      toast.error("Email missing. Please register again.");
      return navigate("/register");
    }

    const payload = {
      email,
      otp: data.otp,
    };

    try {
      setLoading(true);

      const res = await axios.post(
        "https://paygo-bakend.onrender.com/api/auth/verify-otp",
        payload
      );

      toast.success(res.data.message);

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Verify Your Account
        </h2>

        <p className="text-center text-gray-600 mb-4">
          Enter the 6-digit OTP sent to:
          <span className="font-semibold"> {email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* OTP */}
          <div>
            <label className="block text-sm font-medium">Enter OTP</label>
            <input
              type="text"
              maxLength={6}
              className="w-full mt-1 px-4 py-2 border rounded-lg outline-blue-500"
              placeholder="123456"
              {...register("otp")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Didn’t get OTP? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
