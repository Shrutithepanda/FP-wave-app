import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Emails from "./emails/Emails";
import Tasks from "./tasks/Tasks";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import { routes } from "./constants/routes";
// import ErrorComponent from "./pages/ErrorComponent";

// Lazy render the error component
const ErrorComponent = lazy(() => import("./pages/ErrorComponent"))

/**
 * Contains all the routes for the app:
 * public routes - Home page, Register page, Login page
 * private routes - Email pages and Task pages
 */
export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path =  "/" element = {<HomePage/>} />
            <Route path =  "/login" element = {<LoginPage/>} />
            <Route path =  "/register" element = {<RegisterPage/>} />

            {/* Route to inbox by default from the address in the URL */}
            <Route path = {routes.main.path} element = {<Navigate to = {`${routes.main.path}/inbox`}/>} />
            
            <Route path = {routes.main.path} element = {routes.main.element}>
                {/* Child routes */}
                <Route path = {`${routes.emails.path}/:type`} element = {routes.emails.element} errorElement = {<ErrorComponent/>} />
                <Route path = {routes.view.path} element = {routes.view.element} errorElement = {<ErrorComponent/>} />
            </Route>

            <Route path = "/tasks" element = {<Tasks/>} />

            <Route path = {routes.invalid.path} element = {<Navigate to = {`${routes.main.path}/inbox`} />} />
        </Route>

    )
)

// export const router = createBrowserRouter([
//     {path: "/", element: <HomePage/>},
//     {path: "/login", element: <LoginPage/>},
//     {path: "/register", element: <RegisterPage/>},
//     {path: "/emails", element: 
//         <ProtectedRoutes>
//             <Emails/>
//         </ProtectedRoutes>
//     },
//     {path: "/tasks", element: 
//         <ProtectedRoutes>
//             <Tasks/>
//         </ProtectedRoutes>
//     },
// ])