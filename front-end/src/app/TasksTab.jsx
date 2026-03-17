import { Suspense, useState } from "react"
import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"

import Loader from "../customComponents/Loader"
import AppHeader from "../customComponents/AppHeader"
import SideBar from "../customComponents/Sidebar"

/**
 * 
 * @returns contents to show in the Tasks tab - header, sidebar and children pages
 */
const TasksTab = () => {
    const [openSidebar, setOpenSidebar] = useState(true)  

    /**
     * Toggle sidebar's open state
     */
    const toggleSidebar = () => setOpenSidebar(prevState => !prevState)

    return (
        <Box>
            {/* Header */}
            <AppHeader toggleSidebar = { toggleSidebar } />
            
            {/* Sidebar for tasks pages and content in the pages */}
            <Box>
                <SideBar openSidebar = { openSidebar } tasks = { true } />
                
                {/* Fallback to the loader component until children (lazy loaded) are rendered */}
                <Suspense fallback = { <Loader/> } >
                    <Outlet context = {{ openSidebar }} />
                </Suspense>
            </Box>
        </Box>
    )
}

export default TasksTab