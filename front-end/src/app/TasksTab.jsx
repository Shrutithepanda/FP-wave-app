import { Box } from "@mui/material"
import { Suspense, useState } from "react"
import { Outlet } from "react-router-dom"
import AppHeader from "../customComponents/AppHeader"
import SideBar from "../customComponents/Sidebar"
import Loader from "../customComponents/Loader"


const TasksTab = () => {
    const [openSidebar, setOpenSidebar] = useState(true)  
    const toggleSidebar = () => setOpenSidebar(prevState => !prevState)

    return (
        <Box>
            {/* Header */}
            <AppHeader toggleSidebar = { toggleSidebar } />
            
            {/* Sidebar for tasks pages and content in the pages */}
            <Box>
                <SideBar openSidebar = { openSidebar } tasks = { true } />
                {/* Fallback to the loader component until children (lazy loaded) are rendered */}
                <Suspense fallback = {<Loader/>} >
                    <Outlet context = {{ openSidebar }} />
                </Suspense>
            </Box>
        </Box>
    )
}

export default TasksTab