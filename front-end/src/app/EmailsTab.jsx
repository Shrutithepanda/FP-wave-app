import { Box } from "@mui/material"
import AppHeader from "../customComponents/AppHeader"
import SideBar from "../customComponents/Sidebar"
import { Suspense, useState } from "react"
import { Outlet } from "react-router-dom"
import Loader from "../customComponents/Loader"


const EmailsTab = () => {
    const [openSidebar, setOpenSidebar] = useState(true)  
    const toggleSidebar = () => setOpenSidebar(prevState => !prevState)

    return (
        <Box>
            {/* Header */}
            <AppHeader toggleSidebar = {toggleSidebar} />
            
            {/* Sidebar and content in the pages */}
            <Box>
                <SideBar openSidebar = {openSidebar} />
                {/* Fallback to the loader component until children (lazy loaded) are rendered */}
                <Suspense fallback = {<Loader/>} >
                    <Outlet context = {{ openSidebar }} />
                </Suspense>
            </Box>
        </Box>
    )
}

export default EmailsTab