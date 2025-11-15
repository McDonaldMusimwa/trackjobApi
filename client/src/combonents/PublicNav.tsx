import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { routes } from "../staticdata/features";

function PublicNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="relative w-full py-4 md:py-6 px-4 md:px-8 flex justify-between items-center shadow-sm bg-white">
            <h1 className="text-xl md:text-2xl font-bold text-black">TrekJob</h1>

            {/* Desktop Navigation */}
            <div className="space-x-6 text-gray-700 font-medium hidden md:flex">
                {routes.map(route => (
                    <Link
                        key={route.link}
                        to={route.link}
                        className="hover:text-green-600 transition-colors"
                    >
                        {route.route}
                    </Link>
                ))}
            </div>

            {/* Desktop Sign In */}
            <Link to="/sign-in" className="hidden md:block rounded-2xl px-6 font-medium text-black hover:text-green-600 transition-colors">
                Sign In
            </Link>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X size={24} className="text-black" /> : <Menu className="text-black" size={24} />}
            </button>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
                    <nav className="flex flex-col p-4 space-y-3">
                        {routes.map(route => (
                            <Link
                                key={route.link}
                                to={route.link}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-700 font-medium hover:text-green-600 transition-colors py-2"
                            >
                                {route.route}
                            </Link>
                        ))}
                        <Link
                            to="/sign-in"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-700 font-medium hover:text-green-600 transition-colors py-2 border-t pt-3"
                        >
                            Sign In
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default PublicNavbar