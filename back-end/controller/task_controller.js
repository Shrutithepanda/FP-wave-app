import Tasks from "../model/task.js"

export const getProjects = async (req, res) => {
    try {
        let projects

        if (req.params.type === "projects") {
            projects = await Tasks.fetchProjects()
            // console.log(tasks)
        }
        return res.status(200).json(projects)
    } catch (error) {
        console.log("controller, getProjects: ", error.message)
        res.status(500).json(error.message)
    }
}

export const moveProjectToTrash = async (req, res) => {
    try {
        const project = Tasks.updateFolderName(req.body, "trash")
        return res.status(200).json("project moved to high priority folder successfully", project)
    } catch (error) {
        console.log("controller, toggleHighPriorityProjects: ", error.message)
        res.status(500).json(error.message)
    }
}

export const toggleHighPriorityProjects = async (req, res) => {
    try {
        const projects = Tasks.updatePriority([req.body?.id], req.body?.priority)
        return res.status(200).json("project moved to high priority folder successfully", projects)
    } catch (error) {
        console.log("controller, toggleHighPriorityProjects: ", error.message)
        res.status(500).json(error.message)
    }
}