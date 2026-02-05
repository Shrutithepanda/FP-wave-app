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
            <Route path = {routes.emails_tab.path} element = {<Navigate to = {`${routes.emails_tab.path}/inbox`}/>} />
            
            <Route path = {routes.emails_tab.path} element = {routes.emails_tab.element}>
                {/* Child routes for emails */}
                <Route path = {`${routes.emails.path}/:type`} element = {routes.emails.element} errorElement = {<ErrorComponent/>} />
                <Route path = {routes.view_email.path} element = {routes.view_email.element} errorElement = {<ErrorComponent/>} />
            </Route>

            <Route path = {routes.tasks_tab.path} element = {<Navigate to = {`${routes.tasks.path}/projects`}/>} />
            
            <Route path = {routes.tasks_tab.path} element = {routes.tasks_tab.element}>
                {/* Child routes for tasks */}
                <Route path = {`${routes.tasks.path}/:type`} element = {routes.tasks.element} errorElement = {<ErrorComponent/>} />
                <Route path = {routes.view_task.path} element = {routes.view_task.element} errorElement = {<ErrorComponent/>} />
            </Route>

            <Route path = {routes.invalid.path} element = {<Navigate to = {`${routes.emails_tab.path}/inbox`} />} />
        </Route>

    )
)
