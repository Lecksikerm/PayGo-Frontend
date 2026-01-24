import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPage = location.state?.from || "/dashboard";

    const { user, setUser } = useContext(UserContext);
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("accessToken");

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (!token) return navigate("/login");

        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    "https://paygo-backend-9srx.onrender.com/api/profile",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAvatar(res.data.user.avatar || null);
                setUser(res.data.user);
                reset({
                    firstName: res.data.user.firstName,
                    lastName: res.data.user.lastName,
                    phone: res.data.user.phone || "",
                    address: res.data.user.address || "",
                });
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load profile");
            }
        };

        fetchProfile();
    }, [token, navigate, reset, setUser]);

    const onUploadAvatar = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoading(true);
            const res = await axios.post(
                "https://paygo-backend-9srx.onrender.com/api/profile/avatar",
                formData,
                {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                }
            );
            toast.success(res.data.message);
            const updatedUser = { ...user, avatar: res.data.avatar };
            setUser(updatedUser);
            setAvatar(res.data.avatar);
        } catch (err) {
            toast.error(err.response?.data?.message || "Avatar upload failed");
        } finally {
            setLoading(false);
        }
    };

    const onUpdateProfile = async (data) => {
        try {
            setLoading(true);
            const res = await axios.put(
                "https://paygo-backend-9srx.onrender.com/api/profile",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(res.data.message);
            const updatedUser = { ...user, ...res.data.user };
            setUser(updatedUser);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const onChangePassword = async (e) => {
        e.preventDefault();

        // get values from the form
        const currentPassword = e.target.currentPassword.value;
        const newPassword = e.target.newPassword.value;

        if (!currentPassword || !newPassword) {
            toast.error("Please fill both fields");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.put(
                "https://paygo-backend-9srx.onrender.com/api/profile/change-password",
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message);

            localStorage.clear();
            setUser(null);
            navigate("/login");
        } catch (err) {
            console.log("Password change error:", err.response?.data);
            toast.error(err.response?.data?.message || "Change password failed");
        } finally {
            setLoading(false);
            e.target.reset();
        }
    };

    const onDeleteAccount = async () => {

        const password = prompt("Enter your password to delete your account:");
        if (!password) return;

        try {
            setLoading(true);
            const res = await axios.delete(
                "https://paygo-backend-9srx.onrender.com/api/profile/delete",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { password },
                }
            );
            toast.success(res.data.message);

            setUser(null);
            localStorage.clear();
            navigate("/register");
        } catch (err) {
            console.log("Delete account error:", err.response?.data);
            toast.error(err.response?.data?.message || "Delete account failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 px-8 py-10">
            <button
                className="mb-4 text-blue-600 hover:underline"
                onClick={() => navigate(previousPage)}
            >
                ← Go Back
            </button>

            <h2 className="text-2xl font-bold mb-6">Profile</h2>

            {/* Avatar */}
            <div className="mb-6 flex items-center space-x-4">
                <img
                    src={avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />
                <input type="file" onChange={onUploadAvatar} className="cursor-pointer" />
            </div>

            {/* Update Info Form */}
            <form onSubmit={handleSubmit(onUpdateProfile)} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Update Profile Info</h3>
                <input {...register("firstName")} placeholder="First Name" className="w-full px-4 py-2 border rounded-lg" />
                <input {...register("lastName")} placeholder="Last Name" className="w-full px-4 py-2 border rounded-lg" />
                <input {...register("phone")} placeholder="Phone" className="w-full px-4 py-2 border rounded-lg" />
                <input {...register("address")} placeholder="Address" className="w-full px-4 py-2 border rounded-lg" />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>

            {/* Change Password Form */}
            <form onSubmit={onChangePassword} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Change Password</h3>
                <input name="currentPassword" type="password" placeholder="Current Password" className="w-full px-4 py-2 border rounded-lg" />
                <input name="newPassword" type="password" placeholder="New Password" className="w-full px-4 py-2 border rounded-lg" />
                <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300">
                    {loading ? "Updating..." : "Change Password"}
                </button>
            </form>

            {/* Delete Account */}
            <div className="bg-white p-6 rounded-lg shadow">
                <button
                    onClick={onDeleteAccount}
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
                >
                    {loading ? "Processing..." : "Delete Account"}
                </button>
            </div>
        </div>
    );
}


