import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    FiSend,
    FiCreditCard,
    FiBell,
    FiShield,
    FiSmartphone,
    FiUsers,
    FiCheckCircle,
    FiArrowRight,
    FiMenu,
    FiX,
    FiStar,
    FiTrendingUp,
    FiLock
} from "react-icons/fi";

export default function Landing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll for navbar styling
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <FiCreditCard className="w-6 h-6" />,
            title: "Smart Wallet",
            description: "Fund instantly via Paystack with real-time balance updates. No delays, no hidden fees.",
            color: "bg-blue-500"
        },
        {
            icon: <FiSend className="w-6 h-6" />,
            title: "Instant Transfers",
            description: "Send money to any email address. Recipients get credited immediately, 24/7.",
            color: "bg-green-500"
        },
        {
            icon: <FiUsers className="w-6 h-6" />,
            title: "Smart Beneficiaries",
            description: "Auto-save frequent contacts with nicknames. One-tap transfers to your favorites.",
            color: "bg-purple-500"
        },
        {
            icon: <FiBell className="w-6 h-6" />,
            title: "Real-time Alerts",
            description: "Get instant push notifications for every transaction. Monitor your money live.",
            color: "bg-orange-500"
        },
        {
            icon: <FiLock className="w-6 h-6" />,
            title: "PIN Protection",
            description: "Every transfer secured by your 4-digit PIN. Bank-grade encryption standard.",
            color: "bg-red-500"
        },
        {
            icon: <FiSmartphone className="w-6 h-6" />,
            title: "Mobile First",
            description: "Native-app experience on web. Works perfectly on any device, anywhere.",
            color: "bg-indigo-500"
        }
    ];

    const stats = [
        { value: "₦0", label: "Transaction Fees", subtext: "Always free" },
        { value: "24/7", label: "Availability", subtext: "Never down" },
        { value: "100%", label: "Secure", subtext: "Encrypted" },
        { value: "<2s", label: "Transfer Speed", subtext: "Lightning fast" }
    ];

    const steps = [
        {
            num: "01",
            title: "Create Account",
            desc: "Sign up with email in seconds"
        },
        {
            num: "02",
            title: "Fund Wallet",
            desc: "Add money via Paystack securely"
        },
        {
            num: "03",
            title: "Send Money",
            desc: "Enter email, amount & PIN"
        },
        {
            num: "04",
            title: "Done!",
            desc: "Track in real-time history"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navbar - Sticky with blur effect */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                PayGo
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
                            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Sign In</Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Get Started Free
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
                        <div className="px-4 py-4 space-y-3">
                            <a href="#features" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Features</a>
                            <a href="#how-it-works" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">How It Works</a>
                            <Link to="/login" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Sign In</Link>
                            <Link to="/register" className="block mx-3 py-2.5 bg-blue-600 text-white text-center font-semibold rounded-lg">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10"></div>
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-purple-100/50 to-transparent rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/4"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Left Content */}
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                Now with Smart Notifications
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-slate-900 mb-6">
                                Your Money,{" "}
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Simplified.
                                </span>
                            </h1>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                                Send money instantly using just an email address.
                                Track every transaction in real-time with bank-grade security.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Create Free Account <FiArrowRight />
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all"
                                >
                                    Access Wallet
                                </Link>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                                {['Instant Transfers', 'Zero Fees', 'Secure PIN'].map((item) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <FiCheckCircle className="text-green-500 w-4 h-4" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Content - Abstract UI Mockup */}
                        <div className="relative lg:pl-8">
                            <div className="relative mx-auto max-w-sm lg:max-w-md">
                                {/* Phone Frame */}
                                <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl">
                                    <div className="bg-white rounded-[2rem] overflow-hidden">
                                        {/* Mock Header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                            </div>
                                            <p className="text-sm opacity-80 mb-1">Total Balance</p>
                                            <p className="text-3xl font-bold">₦50,000</p>
                                        </div>

                                        {/* Mock Actions */}
                                        <div className="p-6 space-y-4">
                                            <div className="flex gap-3">
                                                <div className="flex-1 bg-blue-50 p-4 rounded-2xl text-center">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white"><FiSend /></div>
                                                    <p className="text-xs font-medium text-slate-700">Send</p>
                                                </div>
                                                <div className="flex-1 bg-green-50 p-4 rounded-2xl text-center">
                                                    <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white"><FiCreditCard /></div>
                                                    <p className="text-xs font-medium text-slate-700">Fund</p>
                                                </div>
                                            </div>

                                            {/* Mock Transaction */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-semibold text-slate-400 uppercase">Recent</p>
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                                        <div className="flex-1">
                                                            <div className="h-2 bg-slate-200 rounded w-24 mb-1"></div>
                                                            <div className="h-2 bg-slate-100 rounded w-16"></div>
                                                        </div>
                                                        <div className="h-2 bg-slate-200 rounded w-12"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl animate-bounce">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <FiTrendingUp /> <span className="font-bold text-sm">+₦5,000</span>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <FiShield />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700">Secured</p>
                                            <p className="text-[10px] text-slate-500">256-bit SSL</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-semibold text-slate-600 mb-0.5">{stat.label}</div>
                                <div className="text-xs text-slate-400">{stat.subtext}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-3">Features</h2>
                        <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Everything You Need</h3>
                        <p className="text-lg text-slate-600">
                            Built with modern financial needs in mind. Experience seamless money management.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group relative p-8 bg-white rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 lg:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-3">How It Works</h2>
                        <h3 className="text-3xl lg:text-4xl font-bold text-slate-900">Send Money in 4 Steps</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative">
                                {idx !== 3 && (
                                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
                                )}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10">
                                    <div className="text-4xl font-black text-blue-100 absolute top-4 right-4">{step.num}</div>
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-4 relative z-10">
                                        {step.num}
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                                    <p className="text-slate-600 text-sm">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        Ready to simplify your payments?
                    </h2>
                    <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                        Join thousands of users who trust PayGo. Get started in less than 2 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-all hover:shadow-lg"
                        >
                            Create Free Account <FiArrowRight />
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-full font-semibold hover:bg-white/10 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-slate-400">
                        No credit card required • Instant activation • Always free
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-2">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">P</span>
                                </div>
                                <span className="text-xl font-bold text-slate-900">PayGo</span>
                            </Link>
                            <p className="text-slate-500 max-w-sm leading-relaxed">
                                The modern way to send and receive money. Fast, secure, and designed for your mobile lifestyle.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
                            <ul className="space-y-3">
                                {['Login', 'Register', 'Forgot Password'].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to={`/${item.toLowerCase().replace(' ', '-')}`}
                                            className="text-slate-500 hover:text-blue-600 transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                            <ul className="space-y-3">
                                {['Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
                                    <li key={item}>
                                        <span className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
                        © {new Date().getFullYear()} PayGo • Built for the Future of Finance
                    </div>
                </div>
            </footer>
        </div>
    );
}