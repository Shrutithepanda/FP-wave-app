import Tasks from "../model/task.js"

/**
 * Get projects from the database based on the folder name or priority from the Projects table
 * @param {string} req - params.type: important or others
 * @param {object} res 
 * @returns a JSON object containing projects according to parameter type or an error response
 */
export const fetchProjects = async (req, res) => {
    try {
        let projects

        if (req.params.type === "important") {
            // If param type is important, fetch records for the current user 
            // where the "important" value is true
            projects = await Tasks.fetchProjectsByPriority(req.headers?.user)
        }
        else {
            // For all the other types, fetch records for the current user 
            // where the folder name matches the param type
            projects = await Tasks.fetchProjectsByFolder(req.headers?.user, req.params.type)
        }

        // Return status code 200 OK and projects object
        return res.status(200).json(projects)

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, getProjects: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Move the projects requested to trash by setting the folder to trash for the matching records
 * @param {int} req - project id
 * @param {object} res 
 * @returns a success response and the project(s) moved to trash or an error response
 */
export const moveProjectToTrash = async (req, res) => {
    try {
        // Update folder name of the requested project to trash
        const project = await Tasks.updateFolderName(req.body, "trash")

        // Return status code 200 OK and the updated project
        return res.status(200).json("project moved to trash folder successfully", project)

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, moveProjectsToTrash: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Toggle important projects when the client clicks the bookmark icon
 * @param {object} req - project id, priority value
 * @param {object} res 
 * @returns a success response and project(s) marked important or an error response
 */
export const toggleHighPriorityProjects = async (req, res) => {
    try {
        // Update the priority of the requested project 
        const projects = await Tasks.updatePriority([req.body?.id], req.body?.priority)

        // Return status code 200 OK and the updated project
        return res.status(200).json("project priority updated successfully", projects)

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, toggleHighPriorityProjects: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Create a project with the given data in the Projects table
 * @param {object} req - title, description, due date
 * @param {object} res 
 * @returns a success response and the project created or an error response
 */
export const createProject = async (req, res) => {
    try {
        if (req.body?.title, req.body?.description, req.body?.due_date) {
            // If all the fields are present in the request, insert a record into the table
            const project = await Tasks.insertProject(req.body)

            // Return status code 200 OK and the project created
            return res.status(200).json("project created successfully", project)
        }

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, createProject: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Create a task with the given data in the Tasks table
 * @param {object} req - task name, status, due date
 * @param {object} res 
 * @returns a success response and the task created or an error response
 */
export const createTask = async (req, res) => {
    try {
        if (req.body?.task_name, req.body?.status, req.body?.due_date) {
            // If all the fields are present in the request, insert a record into the table
            const task = await Tasks.insertTask(req.body)

            // Return status code 200 OK and the task created
            return res.status(200).json("task created successfully", task)
        }

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, createTask: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Fetch tasks from the Tasks table for the current user and current project
 * @param {object} req - user id, project id from req.headers
 * @param {object} res 
 * @returns a JSON object containing tasks for the current user and the current project or an error response
 */
export const fetchTasks = async (req, res) => {
    try {
        // Fetch tasks where the current user and the current projects match
        const tasks = await Tasks.fetchTasks(req.headers?.user, req.headers?.project)

        // Return status code 200 OK and tasks object
        return res.status(200).json(tasks)

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, fetchTasks: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Update a project with the given data in the Projects table
 * @param {object} req - fields: title, description, status, due date; project id
 * @param {object} res 
 * @returns a success response and the updated project or an error response
 */
export const updateProject = async (req, res) => {
    try {
        if (req.body?.title, req.body?.description, req.body?.status, req.body?.due_date) {
            // Update a project if all the required fields are present
            const project = await Tasks.updateProject(req.body, req.body.id)

            // Return status code 200 OK and the project updated
            return res.status(200).json("project updated successfully", project)
        }

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, updateProject: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Update a task with the given data in the Tasks table
 * @param {object} req - fields to update: task name, status, due date; ids: project id and task id
 * @param {object} res 
 * @returns a success response and the updated task or an error response
 */
export const updateTask = async (req, res) => {
    try {
        if (req.body?.task_name, req.body?.status, req.body?.due_date) {
            // Update a task if all the required fields are present
            const task = await Tasks.updateTask(req.body, req.body.project_id, req.body.id)

            // Return status code 200 OK and the task updated
            return res.status(200).json("task updated successfully", task)
        }

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, updateTask: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Delete project(s) from the Projects table
 * @param {int} req - project id
 * @param {string} res 
 * @returns a success response or error
 */
export const deleteProjects = async (req, res) => {
    try {
        // Delete a project
        await Tasks.deleteProjects(req.body)

        // Return status code 200 OK
        return res.status(200).json("project deleted successfully")

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, deleteProjects: ", error.message)
        res.status(500).json(error.message)
    }
}

/**
 * Delete a task from the Tasks table
 * @param {int} req - task id
 * @param {object} res 
 * @returns a success response and remaining tasks or an error response
 */
export const deleteTask = async (req, res) => {
    try {
        // Delete a task
        const tasks = await Tasks.deleteTask(req.body?.id)

        // Return status code 200 OK and remaining tasks
        return res.status(200).json("task deleted successfully", tasks)

    } catch (error) {
        // Return status 500 Internal server error and error message
        console.log("controller, deleteTask: ", error.message)
        res.status(500).json(error.message)
    }
}