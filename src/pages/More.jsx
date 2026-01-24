import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function More() {
    const navigate = useNavigate();

    const billOptions = [
        {
            name: "E-commerce",
            logo: "https://cdn-icons-png.flaticon.com/512/891/891448.png"
        },
        {
            name: "TV Subscription",
            logo: "https://cdn-icons-png.flaticon.com/512/483/483947.png"
        },
        {
            name: "Electricity Subscription",
            logo: "https://cdn-icons-png.flaticon.com/512/1048/1048945.png"
        },
        {
            name: "Water Subscription",
            logo: "https://cdn-icons-png.flaticon.com/512/4149/4149673.png"
        },
        {
            name: "Internet/Data",
            logo: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
        },
        {
            name: "Insurance",
            logo: "https://cdn-icons-png.flaticon.com/512/942/942748.png"
        },
    ];

    return (
        <motion.div
            className="min-h-screen bg-gray-100 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Navbar */}
            <nav className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600">Bill Payment</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                    ← Back
                </button>
            </nav>

            {/* Bill Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {billOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer"
                        onClick={() => alert(`${option.name} is not implemented yet`)}

                        // Animation when card appears
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}

                        // Hover animation
                        whileHover={{ scale: 1.08, rotate: 1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src={option.logo} alt={option.name} className="w-12 h-12 mb-4" />
                        <span className="text-gray-700 font-medium text-center">{option.name}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
