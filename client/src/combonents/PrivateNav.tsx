import { Link } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { LogOut } from 'lucide-react'
import { navlinks } from '../staticdata/features';

export default function PrivateNav(): JSX.Element {
    const { user } = useUser()
    const { signOut } = useClerk()

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <>
            {/* Desktop Sidebar - Fixed on left */}
            <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white shadow-2xl flex-col border-r border-gray-700">
                {/* Logo */}
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold">
                        <Link to="/" className="hover:text-cyan-400 transition-colors">
                            Trekjob
                        </Link>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    {navlinks.map((link): JSX.Element => {
                        const IconComponent = link.icon
                        return (
                            <Link
                                key={link.id}
                                to={link.link}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                                activeProps={{
                                    className:
                                        'flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                                }}
                            >
                                <IconComponent size={20} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile Section */}
                {user && (
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-3 mb-3">
                            {user.imageUrl && (
                                <img
                                    src={user.imageUrl}
                                    alt={user.firstName || 'User'}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user.emailAddresses[0]?.emailAddress}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                )}
            </aside>

            {/* Mobile Bottom Navigation - Icons only */}
            <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-900 text-white shadow-2xl border-t border-gray-700 z-50">
                <div className="flex justify-around items-center h-20">
                    {navlinks.map((link): JSX.Element => {
                        const IconComponent = link.icon
                        return (
                            <Link
                                key={link.id}
                                to={link.link}
                                className="flex justify-center items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
                                activeProps={{
                                    className:
                                        'flex justify-center items-center p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors',
                                }}
                                title={link.name}
                            >
                                <IconComponent size={24} />
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}