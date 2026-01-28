import { Link } from "react-router-dom";
import {
    FiSend,
    FiCreditCard,
    FiBell,
    FiShield,
    FiSmartphone,
    FiUsers,
    FiCheckCircle,
    FiArrowRight
} from "react-icons/fi";

export default function Landing() {
    const features = [
        {
            icon: <FiCreditCard className="w-8 h-8 text-blue-600" />,
            title: "Smart Wallet",
            description: "Fund your wallet instantly via Paystack and manage your balance with real-time updates."
        },
        {
            icon: <FiSend className="w-8 h-8 text-green-600" />,
            title: "Instant Transfers",
            description: "Send money to anyone with an email address. Recipients get credited immediately."
        },
        {
            icon: <FiUsers className="w-8 h-8 text-purple-600" />,
            title: "Saved Beneficiaries",
            description: "Automatically save frequent contacts. Add nicknames for quick access to your favorite recipients."
        },
        {
            icon: <FiBell className="w-8 h-8 text-orange-600" />,
            title: "Smart Notifications",
            description: "Get instant alerts for every transaction. Track your money with real-time credit/debit notifications."
        },
        {
            icon: <FiShield className="w-8 h-8 text-red-600" />,
            title: "Secure PIN Protection",
            description: "Every transfer is protected by your personal 4-digit PIN. Your money, your control."
        },
        {
            icon: <FiSmartphone className="w-8 h-8 text-indigo-600" />,
            title: "Mobile First",
            description: "Designed for your smartphone. Access your wallet anytime, anywhere, on any device."
        }
    ];

    const steps = [
        {
            step: "01",
            title: "Create Account",
            desc: "Sign up in seconds with your email and secure password"
        },
        {
            step: "02",
            title: "Fund Wallet",
            desc: "Add money using Paystack - fast, secure, and reliable"
        },
        {
            step: "03",
            title: "Send Money",
            desc: "Enter recipient email, amount, and your PIN to transfer instantly"
        },
        {
            step: "04",
            title: "Track History",
            desc: "View all transactions with sender/recipient details in your history"
        }
    ];

    const benefits = [
        "No hidden fees",
        "Bank-grade security",
        "24/7 availability",
        "Instant notifications",
        "Saved beneficiaries",
        "Transaction history"
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 lg:px-12 py-5 shadow-sm bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <h1 className="text-2xl font-bold text-blue-600">PayGo</h1>
                </div>
                <div className="space-x-4 flex items-center">
                    <Link
                        to="/login"
                        className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-lg shadow-blue-200"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-2xl lg:pr-12">
                    <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                        Now with Smart Notifications
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
                        Your Money, <span className="text-blue-600">Simplified.</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Send money to anyone using just their email. Track every transaction in real-time.
                        Save your favorite contacts for lightning-fast transfers. Welcome to the future of digital payments.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-lg font-semibold transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            Create Free Account <FiArrowRight />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 text-lg font-semibold transition flex items-center justify-center"
                        >
                            Access Wallet
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            <span>Instant Transfers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            <span>Secure PIN</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-green-500" />
                            <span>No Hidden Fees</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 lg:mt-0 relative">
                    <div className="absolute -inset-4 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
                    <img
                        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="PayGo Mobile Banking"
                        className="w-full max-w-lg lg:w-[500px] relative z-10 rounded-2xl shadow-2xl"
                    />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-3xl font-bold text-blue-600 mb-1">₦0</div>
                        <div className="text-gray-500 text-sm">Transaction Fees</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
                        <div className="text-gray-500 text-sm">Available</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
                        <div className="text-gray-500 text-sm">Secure</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-blue-600 mb-1">Instant</div>
                        <div className="text-gray-500 text-sm">Delivery</div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 lg:px-16 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-blue-600 font-semibold mb-2 uppercase tracking-wide">How It Works</h3>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Send Money in 4 Easy Steps</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 relative">
                                <div className="text-5xl font-bold text-blue-100 absolute top-4 right-4">{item.step}</div>
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-4 relative z-10">
                                    {item.step}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 lg:px-16 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-blue-600 font-semibold mb-2 uppercase tracking-wide">Features</h3>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Everything You Need</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Built with modern financial needs in mind. Experience seamless money management with powerful features.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all bg-white"
                            >
                                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* App Screenshots / Visual Flow */}
            <section className="py-20 px-6 lg:px-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-blue-200 font-semibold mb-2 uppercase tracking-wide">App Preview</h3>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Beautiful. Simple. Powerful.</h2>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                Our intuitive interface puts everything at your fingertips.
                                View your balance at a glance, send money with two taps, and track every transaction with detailed insights.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                            <FiCheckCircle className="w-4 h-4" />
                                        </div>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/register"
                                className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition"
                            >
                                Start Using PayGo
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Banking Dashboard */}
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Dashboard Preview"
                                    className="rounded-2xl shadow-2xl transform translate-y-8"
                                />
                                {/* Analytics Interface */}
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80"
                                    alt="Analytics Dashboard"
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>

                            {/* Additional images row */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <img
                                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Mobile Banking"
                                    className="rounded-2xl shadow-2xl"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Transfer Screen"
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notification Feature Highlight */}
            <section className="py-20 px-6 lg:px-16 bg-gray-50">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                            alt="Notifications"
                            className="rounded-2xl shadow-xl w-full"
                        />
                    </div>
                    <div className="lg:w-1/2">
                        <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
                            🔔 New Feature
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Never Miss a Transaction
                        </h2>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            Our smart notification system keeps you updated in real-time.
                            Get instant alerts when you receive money, complete transfers, or when your wallet is funded.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 font-bold">💰</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Credit Alerts</h4>
                                    <p className="text-sm text-gray-500">Know immediately when money arrives</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-600 font-bold">📤</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Debit Confirmations</h4>
                                    <p className="text-sm text-gray-500">Track every outgoing payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 text-center bg-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                        Ready to simplify your payments?
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                        Join thousands of users who trust PayGo for their daily transactions.
                        Get started in less than 2 minutes.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-10 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-lg font-bold transition shadow-xl shadow-blue-200"
                    >
                        Create Your Free Account
                    </Link>
                    <p className="mt-4 text-sm text-gray-500">
                        No credit card required • Instant setup • Always free
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">P</span>
                            </div>
                            <span className="text-2xl font-bold text-white">PayGo</span>
                        </div>
                        <p className="text-gray-400 mb-4 max-w-sm">
                            The modern way to send and receive money. Fast, secure, and designed for your mobile lifestyle.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                            <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
                            <li><Link to="/forgot-password" className="hover:text-white transition">Reset Password</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
                            <li><span className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
                            <li><span className="hover:text-white transition cursor-pointer">Contact Support</span></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} PayGo • All Rights Reserved • Built for the Future of Finance
                </div>
            </footer>
        </div>
    );
}