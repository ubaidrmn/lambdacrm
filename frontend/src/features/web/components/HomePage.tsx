import WebNavbar from "@/components/shared/WebNavbar";
import { Link } from "react-router";

export default function HomePage() {
    return <>
        <WebNavbar />
        <div className="flex flex-col items-center mt-10">
            <h1 className="text-4xl font-bold">Welcome to LambdaCRM</h1>
            <p className="mt-4 text-lg">Your one-stop solution for managing customer relationships.</p>
            <Link to="/login" className="mt-4 text-blue-500 hover:underline">Login</Link>
            <Link to="/signup" className="mt-4 text-blue-500 hover:underline">Sign Up</Link>
        </div>
    </>
}
