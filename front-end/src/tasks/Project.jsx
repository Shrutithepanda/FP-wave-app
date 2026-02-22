import { Box, Checkbox, IconButton, styled, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bookmark, BookmarkFill } from "react-bootstrap-icons"

import { TASK_API_URLS } from "../services/api.urls"
import { routes } from "../constants/routes"
import { Colours } from "../constants/colours"
import useApi from "../hooks/useApi"

const Wrapper = styled(Box) ({
    display: "flex",
    alignItems: "center",
    padding: "0 0 0 10px",
    marginBottom: 3,
    cursor: "pointer",
    "& > div": {
        display: "flex",
        width: "100%",
        flexGrow: 1,
        "& > p": {
            fontSize: 15,
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
    flexDirection: "row"
})

/**
 * 
 * @param {object} project 
 * @param {object} selectedProjects 
 * @param {function} setSelectedProjects 
 * @param {string} type 
 * @param {boolean} setRefresh 
 * @returns a single Project component with details, to show for the Tasks tab
 */
const Project = ({ project, selectedProjects, setSelectedProjects, type, setRefresh }) => {
    const navigate = useNavigate()
    const [indicatorColor, setIndicatorColor] = useState(Colours.notStartedBg)
    
    // Initialise service
    const toggleHighPriorityService = useApi(TASK_API_URLS.toggleHighPriorityProjects)

    /**
     * Mark projects important/unimportant when bookmark icon is clicked
     */
    const toggleHighPriorityTasks = () => {
        toggleHighPriorityService.call({ id: project.id, priority: !project.priority })
        setRefresh(prevState => !prevState)
        window.location.reload()
    }

    /**
     * Select and deselect a project
     */
    const onValueChange = () => {
        if (selectedProjects.includes(project.id)) {
            // If the selected projects already contain this project then filter this one out of the selected projects
            setSelectedProjects(prevState => prevState.filter(id => id != project.id))
        }
        else {
            // If selected projects do not have this project, append this project to the selected projects
            setSelectedProjects(prevState => [...prevState, project.id])

        }
    }

    useEffect(() => {
        /**
         * Set indicator colour of the project according to its status value:
         * not started, in progress, completed, and pending
         */
        const changeIndicatorColor = () => {
            if (project.status === "In progress") {
                setIndicatorColor(Colours.inProgressBg)
            }
            if (project.status === "Completed") {
                setIndicatorColor(Colours.completedBg)
            }
            if (project.status === "Pending") {
                setIndicatorColor(Colours.pendingBg)
            }
        }
        changeIndicatorColor()
    }, [type])

    return (
        <Wrapper sx = {{ background: Colours.cardBg }}>
            {/* Checkbox to mark project important or un-important */}
            <Checkbox 
                size = "small" 
                // checked if the id value exists in the array - selectedProjects
                checked = { selectedProjects.includes(project.id) } 
                onChange = { onValueChange }
            />

            {/* Bookmark icon - filled if project is marked important */}
            {project.priority === true
                ? <IconButton size = "small" onClick = { toggleHighPriorityTasks } sx = {{ marginRight: 1 }}>
                    <BookmarkFill size = {20} color = {Colours.bookmark} style = {{flexShrink: 0}} />
                </IconButton>
                : <IconButton size = "small" onClick = { toggleHighPriorityTasks } sx = {{ marginRight: 1 }}>
                    <Bookmark size = {20} style = {{ flexShrink: 0 }} />
                </IconButton>
            }

            {/* Project info. Navigates to ViewProject page on click. */}
            <Box 
                onClick = {
                    // Route to ViewProject component path
                    () => {
                        navigate(
                            routes.view_task.path, 
                            // Share the project with the component
                            { state: { project: project } }
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
                {/* Project title, due data and indicator */}
                <Box sx = {{ width: "100%", minWidth: 0, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography>{project.title}</Typography>
                        <Box style = {{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Date>
                                { (new window.Date(project.due_date)).getDate() }&nbsp;
                                { (new window.Date(project.due_date)).toLocaleDateString("default", {month: "short"}) }, &nbsp;
                                { (new window.Date(project.due_date)).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"}) }
                            </Date>
                            <Indicator
                                sx = {{ backgroundColor: indicatorColor }}
                            >
                                {/* <CircleFill size = {10} color = {barColor} style = {{marginRight: 5}} /> */}
                                <Typography>
                                    {project.status}
                                </Typography>
                            </Indicator>
                        </Box>
                </Box>

                {/* Project description */}
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

export default Project