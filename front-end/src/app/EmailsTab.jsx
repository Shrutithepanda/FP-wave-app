import { Suspense, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"

import { useEmotion } from "../hooks/EmotionProvider"
import Loader from "../customComponents/Loader"
import AppHeader from "../customComponents/AppHeader"
import SideBar from "../customComponents/Sidebar"

/**
 * 
 * @returns contents to show in the Emails tab - header, sidebar and children pages
 */
const EmailsTab = () => {
    const [openSidebar, setOpenSidebar] = useState(true) 

    const { stressLevel } = useEmotion()

    // Toggle sidebar's open state
    const toggleSidebar = () => setOpenSidebar(prevState => !prevState)

    // useEffect(() => {
    //     // If stress levels are medium or high, close the sidebar
    //     if (openSidebar && stressLevel === "medium" || openSidebar && stressLevel === "high") setOpenSidebar(false)
    // }, [stressLevel])

    return (
        <Box>
            {/* Header */}
            <AppHeader toggleSidebar = { toggleSidebar } />
            
            {/* Sidebar and content in the pages */}
            <Box>
                <SideBar 
                    openSidebar = { openSidebar } tasks = {false} />

                {/* Fallback to the loader component until children (lazy loaded) are rendered */}
                <Suspense fallback = {<Loader/>} >
                    <Outlet context = {{ openSidebar }} />
                </Suspense>
            </Box>
        </Box>
    )
}

export default EmailsTab