import { Box, IconButton, styled, Typography } from "@mui/material"
import { Arrow90degLeft, ArrowClockwise, ArrowLeft, Bookmark, BookmarkFill, CaretLeft, CircleFill, PersonCircle, PlusCircle, Trash3 } from "react-bootstrap-icons"
import { useLocation, useOutletContext } from "react-router-dom"
import { useAuth } from "../hooks/AuthProvider"
import useApi from "../hooks/useApi"
import { EMAIL_API_URLS, TASK_API_URLS } from "../services/api.urls"
import { useEmotion } from "../hooks/EmotionProvider"
import { useEffect } from "react"
import { useState } from "react"
import ComposeTask from "../customComponents/ComposeTask"

const IconWrapper = styled(Box) ({
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
})

const Subject = styled(Box) ({
    fontSize: 22,
    margin: "10px 0 20px 65px",
    display: "flex",
    alignItems: "center"
})

const Indicator = styled(Box) ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px !important",
    color: "#222",
    padding: "0 7px",
    margin: "0 10px",
    textWrap: "nowrap",
    borderRadius: 20,
    height: 25,
    width: "110px !important"
})

const Container = styled(Box) ({
    marginLeft: 15,
    width: "100%",
    // display: "flex",
    "& > div": {
        display: "flex",
        "& > p > span": {
            fontSize: 15,
            color: "#5E5E5E"
        }
    }
})

const Date = styled(Box) ({
    margin: "0 50px 0 auto",
    color: "#5E5E5E"
})

const ViewTask = () => {
    const [indicatorColor, setIndicatorColor] = useState("#CECECE")
    const [circleColor, setCircleColor] = useState("#838282")

    const [openDialog, setOpenDialog] = useState(false)
    const createNewTask = () => setOpenDialog(true)

    const { openSidebar } = useOutletContext()

    const { stressed } = useEmotion()

    // Extract the email from the router's state
    const { state } = useLocation()
    const { project } = state

    const moveProjectToTrashService = useApi(TASK_API_URLS.moveProjectToTrash)
    const toggleHighPriorityService = useApi(TASK_API_URLS.toggleHighPriorityProjects)

    const deleteEmail = () => {
        moveProjectToTrashService.call([project.id])
        window.history.back()
    }

    const toggleHighPriorityMails = () => {
        toggleHighPriorityService.call({ id: project.id, priority: !project.priority })
        // setRefresh(prevState => !prevState)
        window.location.reload()
    }

    const handleRefresh = () => {
        window.location.reload()
    }

    const changeIndicatorColor = () => {
        if (project.status === "In progress") {
            setIndicatorColor("#B0CAF3")
            setCircleColor("#5688d8")
        }
        if (project.status === "Completed") {
            setIndicatorColor("#95DBB6")
            setCircleColor("#47966c")
        }
        if (project.status === "Pending") {
            setIndicatorColor("#fca9aa")
            setCircleColor("#cf6567")
        }
    }

    useEffect(() => {
        changeIndicatorColor()
    }, [])

    return (
        <Box style = {
                openSidebar 
                ? {
                    marginLeft: 158, 
                    marginRight: 30,
                    width: "calc(100% - 188px)",  // -158 px for sidebar's width + space for shadow, marginLeft prev. -> 150
                    boxShadow: `2px 0px 10px 2px ${stressed ? "lightgreen" : "hsl(239, 78%, 86%)"}`, 
                    height: "calc(100vh - 70px)", // -70px for header's height,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: "#F9F9F9"
                } 
                : {
                    marginLeft: 30, 
                    marginRight: 30,
                    width: "calc(100% - 60px)",
                    boxShadow: `2px 0px 10px 2px ${stressed ? "lightgreen" : "hsl(239, 78%, 86%)"}`, 
                    height: "calc(100vh - 70px)",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    background: "#F9F9F9"
                }
            } 
        >
            <IconWrapper>
                <ArrowLeft size = {20} onClick = {() => window.history.back()} style = {{cursor: "pointer"}} />
                <span style = {{marginLeft: "auto", marginRight: 20}}>
                    <ArrowClockwise size = {20} color = "black" style = {{marginLeft: 0, cursor: "pointer"}} onClick = {handleRefresh} />
                </span>
            </IconWrapper>

            <Subject>
                {project.title}
                
                <Indicator 
                    sx = {{backgroundColor: indicatorColor}} 
                >
                    <CircleFill size = {10} color = {circleColor} style = {{marginRight: 5}} />
                    {project.status}
                    </Indicator>
                
                {project.priority === true
                    ? <BookmarkFill size = {20} color = "#7578BD" style = {{marginLeft: 10, cursor: "pointer"}} onClick = {() => toggleHighPriorityMails()} />
                    : <Bookmark size = {20} style = {{marginLeft: 10, cursor: "pointer"}} onClick = {() => toggleHighPriorityMails()} />
                }
                <span style = {{marginLeft: "auto", marginRight: 40}}>
                    <Trash3 size = {20} color = "#E87476" style = {{cursor: "pointer"}} onClick = {() => deleteEmail()} />
                </span>
            </Subject>
            <Box style = {{display: "flex"}} >
                <Container>
                    <Box style = {{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography style = {{marginTop: 10, marginLeft: 50}} >
                            {project.description}
                        </Typography>
                        <Date>
                            {(new window.Date(project.due_date)).getDate()}&nbsp;
                            {(new window.Date(project.due_date)).toLocaleDateString("default", {month: "short"})}&nbsp;
                            {(new window.Date(project.due_date)).getFullYear()},&nbsp;
                            {(new window.Date(project.due_date)).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}
                        </Date>
                    </Box>
                </Container>
            </Box>

            <Box sx = {{marginLeft: 8}}>
                <Typography style = {{marginTop: 20}} >Tasks come here</Typography>
                <IconButton>
                    <PlusCircle size = {25} color = "#79747E" onClick = {() => createNewTask()} />
                </IconButton>
            </Box>

            <ComposeTask openDialog = {openDialog} setOpenDialog = {setOpenDialog} />
        </Box>
    )
}

export default ViewTask