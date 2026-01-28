import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedBeneficiaries } from '../components/SavedBeneficiaries';
import { motion } from 'framer-motion';
import { FaUserFriends, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';

const BeneficiariesPage = () => {
    const navigate = useNavigate();

    const handleSelect = (b) => {
        console.log('Selected:', b);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header - Dark gradient with purple accent */}
            <div className="bg-gradient-to-r from-slate-800 to-purple-900 shadow-lg border-b border-purple-500/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-white hover:text-purple-200"
                    >
                        <FaArrowLeft className="text-sm" />
                        Back to Dashboard
                    </motion.button>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                        <FaUserFriends className="text-lg" />
                        Saved Beneficiaries
                    </h1>
                    <div className="w-20"></div>
                </div>
            </div>

            {/* Main Content - Glass morphism effect */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Page Header - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 text-center"
                >
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                            <FaUserFriends className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Saved Beneficiaries
                        </h2>
                        <p className="text-purple-200 max-w-2xl mx-auto">
                            Manage your saved recipients. These are automatically added when you make successful transfers.
                        </p>
                    </div>
                </motion.div>

                {/* Beneficiaries List - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Your Recipients
                        </h3>
                        <span className="text-purple-300 text-sm bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                            Click to select
                        </span>
                    </div>

                    <SavedBeneficiaries onSelect={handleSelect} />
                </motion.div>

                {/* Info Card - Glass card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <FaInfoCircle className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-purple-300">How It Works</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-purple-200 text-sm">
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                        <span>Recipients are automatically saved after each successful transfer</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                        <span>Click on any beneficiary to quickly send money again</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                        <span>Add nicknames to easily identify frequent contacts</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                                        <span>Remove beneficiaries you no longer need</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BeneficiariesPage;