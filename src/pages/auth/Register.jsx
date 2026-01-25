import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

// Validation schema
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true); // ✅ start loading immediately
    try {
      const res = await api.post("/auth/register", data);

      // ✅ wait for toast to show then navigate
      toast.success(res.data.message, { autoClose: 2000 });

      // Small delay to allow toast to show before navigation
      setTimeout(() => {
        navigate("/login");
      }, 500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false); // ✅ stop loading no matter what
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Sign Up for PayGo
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>First Name</label>
            <input {...register("firstName")} className="w-full mt-1 px-4 py-2 border rounded-lg" disabled={loading} />
            <p className="text-red-500 text-sm">{errors.firstName?.message}</p>
          </div>
          <div>
            <label>Last Name</label>
            <input {...register("lastName")} className="w-full mt-1 px-4 py-2 border rounded-lg" disabled={loading} />
            <p className="text-red-500 text-sm">{errors.lastName?.message}</p>
          </div>
          <div>
            <label>Email</label>
            <input type="email" {...register("email")} className="w-full mt-1 px-4 py-2 border rounded-lg" disabled={loading} />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>
          <div>
            <label>Password</label>
            <input type="password" {...register("password")} className="w-full mt-1 px-4 py-2 border rounded-lg" disabled={loading} />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
