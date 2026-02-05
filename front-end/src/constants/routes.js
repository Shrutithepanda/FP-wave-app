import { lazy } from "react";
import ProtectedRoutes from "../pages/ProtectedRoutes";

const App = lazy(() => import("../app/App"))
const EmailsTab = lazy(() => import("../app/EmailsTab"))
const TasksTab = lazy(() => import("../app/TasksTab"))
const Emails = lazy(() => import("../emails/Emails"))
const Tasks = lazy(() => import("../tasks/Tasks"))
const ViewEmail = lazy(() => import("../emails/ViewEmail"))
const ViewTask = lazy(() => import("../tasks/ViewTask"))

/**
 * Contains paths and elements to show for those paths:
 * main - Email, invalid - _, view - View Email
 */
const routes = {
    emails_tab: {
        path: "/emails",
        element: 
        <ProtectedRoutes>
            {/* <App /> */}
            <EmailsTab />
        </ProtectedRoutes>
    },
    emails: {
        path: "/emails",
        element: 
        <ProtectedRoutes>
            <Emails />
        </ProtectedRoutes>
    },
    view_email: {
        path: "/emails/view",
        element: 
        <ProtectedRoutes>
            <ViewEmail />
        </ProtectedRoutes>
    },

    tasks_tab: {
        path: "/tasks",
        element: 
        <ProtectedRoutes>
            <TasksTab />
        </ProtectedRoutes>
    },
    tasks: {
        path: "/tasks",
        element:
        <ProtectedRoutes>
            <Tasks />
        </ProtectedRoutes>
    },
    view_task: {
        path: "/tasks/view",
        element: 
        <ProtectedRoutes>
            <ViewTask />
        </ProtectedRoutes>
    },
    
    invalid: {
        path: "/*",
        // Something to show when route in URL is invalid
        element: <Emails />
    },
}

export { routes }