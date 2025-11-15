import React from "react"

export default function Footer():React.JSX.Element{

    return (   <footer className="text-center py-6 text-gray-500 text-sm">
            © {new Date().getFullYear()} TrekJob — Job Tracking Made Simple
          </footer>)
}