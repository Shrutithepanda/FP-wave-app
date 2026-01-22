import { lazy } from "react";
import ProtectedRoutes from "../pages/ProtectedRoutes";

const App = lazy(() => import("../app/App"))
const Emails = lazy(() => import("../emails/Emails"))
const Tasks = lazy(() => import("../tasks/Tasks"))
const ViewEmail = lazy(() => import("../emails/ViewEmail"))

/**
 * Contains paths and elements to show for those paths:
 * main - Email, invalid - _, view - View Email
 */
const routes = {
    main: {
        path: "/emails",
        element: 
        <ProtectedRoutes>
            <App />
        </ProtectedRoutes>
    },
    emails: {
        path: "/emails",
        element: 
        <ProtectedRoutes>
            <Emails />
        </ProtectedRoutes>
    },
    view: {
        path: "/emails/view",
        element: 
        <ProtectedRoutes>
            <ViewEmail />
        </ProtectedRoutes>
    },
    invalid: {
        path: "/*",
        // Something to show when route in URL is invalid
        element: <Emails />
    },
}

export { routes }