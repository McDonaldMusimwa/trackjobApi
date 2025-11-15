import { Outlet } from "@tanstack/react-router";
import PrivateNav from "../PrivateNav";



function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="md:ml-64">
            <PrivateNav />
            <main className="pb-20 md:pb-0">
                <Outlet />
                {children}
            </main>
      
        </div>
    )
}

export default PublicLayout