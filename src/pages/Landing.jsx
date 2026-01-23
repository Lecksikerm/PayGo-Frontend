import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-8 py-5 shadow-sm">
                <h1 className="text-3xl font-bold text-blue-600">PayGo</h1>
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="text-gray-600 hover:text-blue-600 font-medium"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between px-10 py-20">
                <div className="max-w-xl">
                    <h2 className="text-5xl font-bold leading-tight text-gray-900 mb-6">
                        Seamless Digital Payments for Everyone.
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                        Send, receive, and manage your money securely with PayGo. Fast,
                        reliable, and built for modern finance.
                    </p>

                    <Link
                        to="/register"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
                    >
                        Create a Free Account
                    </Link>
                </div>

                <div className="mt-10 lg:mt-0">
                    <img
                        src="https://img.freepik.com/free-vector/mobile-banking-isometric-concept_23-2148560381.jpg"
                        alt="Fintech illustration"
                        className="w-[450px]"
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-6 text-gray-500 text-sm">
                © {new Date().getFullYear()} PayGo • All Rights Reserved
            </footer>
        </div>
    );
}
