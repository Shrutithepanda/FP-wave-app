import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Emails from "./emails/Emails";
import Tasks from "./tasks/Tasks";
import ProtectedRoutes from "./pages/ProtectedRoutes";

export const router = createBrowserRouter([
    {path: "/", element: <HomePage/>},
    {path: "/login", element: <LoginPage/>},
    {path: "/register", element: <RegisterPage/>},
    {path: "/emails", element: 
        <ProtectedRoutes>
            <Emails/>
        </ProtectedRoutes>
    },
    {path: "/tasks", element: 
        <ProtectedRoutes>
            <Tasks/>
        </ProtectedRoutes>
    },
])