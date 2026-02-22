import { lazy } from "react";
import ProtectedRoutes from "../pages/ProtectedRoutes";

const EmailsTab = lazy(() => import("../app/EmailsTab"))
const TasksTab = lazy(() => import("../app/TasksTab"))
const Emails = lazy(() => import("../emails/Emails"))
const Projects = lazy(() => import("../tasks/Projects"))
const ViewEmail = lazy(() => import("../emails/ViewEmail"))
const ViewProject = lazy(() => import("../tasks/ViewProject"))

/**
 * Contains paths and elements to show for those paths
 */
const routes = {
    // Emails tab
    emails_tab: {
        path: "/emails",
        element: 
        <ProtectedRoutes>
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
    // Tasks tab
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
            <Projects />
        </ProtectedRoutes>
    },
    view_task: {
        path: "/tasks/view",
        element: 
        <ProtectedRoutes>
            <ViewProject />
        </ProtectedRoutes>
    },
    // Invalid URL
    invalid: {
        path: "/*",
        // Something to show when route in URL is invalid
        element: <Emails />
    },
}

export { routes }