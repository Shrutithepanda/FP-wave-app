import { Box, Checkbox, colors, IconButton, styled, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { routes } from "../constants/routes"
import { Bookmark, BookmarkFill, CircleFill } from "react-bootstrap-icons"
import { EMAIL_API_URLS, TASK_API_URLS } from "../services/api.urls"
import useApi from "../hooks/useApi"
import { Colours } from "../constants/colours"

const Wrapper = styled(Box) ({
    display: "flex",
    alignItems: "center",
    padding: "0 0 0 10px",
    marginBottom: 3,
    // backgroundColor: "#F2F6FC",
    cursor: "pointer",
    "& > div": {
        display: "flex",
        width: "100%",
        flexGrow: 1,
        // flexWrap: "wrap",
        "& > p": {
            fontSize: 15,
            // overflow: "hidden", 
            // whiteSpace: "nowrap", 
            // textOverflow: "ellipsis"
        }
    }
})

const Indicator = styled(Box) ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    color: "#222",
    padding: "0 7px",
    textWrap: "nowrap",
    borderRadius: "15px 0 0 15px",
    height: 25,
    width: "95px !important",
    "& > p": {
        fontSize: "14px !important",
    }
})

const Date = styled(Typography) ({
    marginLeft: "auto",
    marginRight: 20,
    fontSize: "12px !important",
    color: "#404142"
})

const StyledText = styled(Box) ({
    display: "flex", 
    flexDirection: "row", 
    // overflow: "hidden", 
    // width: "90%", whiteSpace: "nowrap", textOverflow: "ellipsis", 
    // background: "pink"
    // color: "#424242"
})

const Task = ({ project, selectedTasks, setSelectedTasks, type, setRefresh }) => {
    const navigate = useNavigate()
    const [indicatorColor, setIndicatorColor] = useState(Colours.notStartedBg)
    const [barColor, setBarColor] = useState(Colours.notStartedCircle)
    const toggleHighPriorityService = useApi(TASK_API_URLS.toggleHighPriorityProjects)

    const toggleHighPriorityTasks = () => {
        toggleHighPriorityService.call({ id: project.id, priority: !project.priority })
        setRefresh(prevState => !prevState)
        window.location.reload()
    }

    const onValueChange = () => {
        // If selected emails already contain this email then filter this one out of the selected emails
        if (selectedTasks.includes(project.id)) {
            setSelectedTasks(prevState => prevState.filter(id => id != project.id))
        }
        // If selected emails do not have this email, append this email to the selected emails
        else {
            setSelectedTasks(prevState => [...prevState, project.id])

        }
    }

    const changeIndicatorColor = () => {
        if (project.status === "In progress") {
            setIndicatorColor(Colours.inProgressBg)
            setBarColor(Colours.inProgressCircle)
        }
        if (project.status === "Completed") {
            setIndicatorColor(Colours.completedBg)
            setBarColor(Colours.completedCircle)
        }
        if (project.status === "Pending") {
            setIndicatorColor(Colours.pendingBg)
            setBarColor(Colours.pendingCircle)
        }
    }

    useEffect(() => {
        changeIndicatorColor()
    }, [type])

    return (
        <Wrapper
            sx = {{ background: Colours.cardBg }}
        >
            <Checkbox 
                size = "small" 
                // checked if the id value exists in the array - selectedEmails
                checked = {selectedTasks.includes(project.id)} 
                onChange = {() => onValueChange()}
            />
            {project.priority === true
                ? <IconButton size = "small" onClick = {() => toggleHighPriorityTasks()} sx = {{marginRight: 1}}>
                    <BookmarkFill size = {20} color = {Colours.bookmark} style = {{flexShrink: 0}} />
                </IconButton>
                : <IconButton size = "small" onClick = {() => toggleHighPriorityTasks()} sx = {{marginRight: 1}}>
                    <Bookmark size = {20} style = {{flexShrink: 0}} />
                </IconButton>
            }

            <Box 
                onClick = {
                    // Route to ViewEmail component path
                    () => {
                        navigate(
                            routes.view_task.path, 
                            // Share the email with the component
                            {state: {project: project}}
                        )
                    }
                }
                sx = {{
                    width: "100%", 
                    minWidth: 0, 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "flex-start", 
                    justifyContent: "space-between", 
                    flexGrow: 1, 
                    paddingTop: 1, 
                    paddingBottom: 1
                }}
            >
                <Box sx = {{width: "100%", minWidth: 0, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <Typography>{project.title}</Typography>
                        <Box style = {{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <Date>
                                {(new window.Date(project.due_date)).getDate()}&nbsp;
                                {(new window.Date(project.due_date)).toLocaleDateString("default", {month: "short"})}, &nbsp;
                                {(new window.Date(project.due_date)).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}
                            </Date>
                            <Indicator
                                sx = {{backgroundColor: indicatorColor, borderRight: `0px solid ${barColor}`}}
                            >
                                {/* <CircleFill size = {10} color = {circleColor} style = {{marginRight: 5}} /> */}
                                <Typography>
                                    {project.status}
                                </Typography>
                            </Indicator>
                        </Box>
                    </Box>

                    <StyledText
                        sx = {{
                            width: "95%",
                            minWidth: 0, 
                            overflow: "hidden",
                        }}
                    >
                        <Box>
                            <Typography 
                                sx = {{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontWeight: "normal", 
                                }}
                            >
                                {project.description}
                            </Typography>                            
                        </Box>
                    </StyledText>
            </Box>
        </Wrapper>
    )
}

export default Task