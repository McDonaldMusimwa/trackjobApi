import { Outlet } from "@tanstack/react-router"
import PublicNavbar from "../PublicNav"
import Footer from "./Footer"


function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
           
   
            <PublicNavbar />
        <main className="pb-20 md:pb-0">
                <Outlet />
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout