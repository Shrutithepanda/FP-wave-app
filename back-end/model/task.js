import supabase from "../../front-end/src/supabase/supabaseClient.js"

/**
 * Model that queries Supabase database for CRUD operations on Projects and Tasks tables
 */
class Tasks {
    /**
     * Fetch projects from the Projects table where priority is true, ordered according to the due date.
     * @param {uuid} id - user_id
     * @returns data or error
    */
    static async fetchProjectsByPriority (id) {
       const { data, error } = await supabase
       .from("Projects")
       .select()
       .eq("user_id", id)
       .eq("priority", true)
       .order("due_date", { ascending: true })
       
       if (error) {
           throw error
        }
        else {
            return data
        }
    }

    /**
     * Fetch projects from the Projects table based on the folder type.
     * @param {uuid} id - user_id
     * @param {string} type 
     * @returns data or error
     */
    static async fetchProjectsByFolder (id, type) {
        const { data, error } = await supabase
        .from("Projects")
        .select()
        .eq("user_id", id)
        .eq("folder", type)
        .order("due_date", { ascending: true })

        if (error) {
            throw error
        }
        else {
            return data
        }
    }
    
    /**
     * Update folder name of a project.
     * @param {id} id - project id
     * @param {string} folder - trash
     * @returns data or error
     */
    static async updateFolderName (id, folder) {
       const { data, error } = await supabase
       .from("Projects")
       .update({ "folder": folder })
       .in("id", id)
       .select()
       
       if (error) {
           throw error
       }
       else {
           return data
       }
    }

    /**
     * Update priority of a project.
     * @param {int} id - project id
     * @param {boolean} value - priority
     * @returns data or error
     */
    static async updatePriority (id, value) {
        const { data, error } = await supabase
        .from("Projects")
        .update({ "priority": value })
        .eq("id", id)
        .select()
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    }

    /**
     * Insert a project in the Projects table.
     * @param {object} project - title, description, due date
     * @returns data or error
     */
    static async insertProject (project) {
        const { data, error } = await supabase
        .from("Projects")
        .insert(project)
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    }

    /**
     * Insert a task in the Tasks table.
     * @param {object} task - task name, status, due data
     * @returns data or error
     */
    static async insertTask (task) {
        const { data, error } = await supabase
        .from("Tasks")
        .insert(task)
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    }

    /**
     * Fetch tasks from Tasks table for the current user and current project, ordered by due date.
     * @param {uuid} id - user_id
     * @param {int} projectId 
     * @returns data or error
     */
    static async fetchTasks (id, projectId) {
        const { data, error } = await supabase
        .from("Tasks")
        .select()
        .eq("user_id", id)
        .eq("project_id", projectId)
        .order("due_date", { ascending: true })

        if (error) {
            throw error
        }
        else {
            return data
        }
    }

    /**
     * Update a project's data in the Projects table.
     * @param {object} project - title, description, status, due date
     * @param {int} projectId
     * @returns data or error
     */
    static async updateProject (project, projectId) {
        const { data, error } = await supabase
        .from("Projects")
        .update(project)
        .eq("id", projectId)
        .select()
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    } 

    /**
     * Update a task's data in the Tasks table.
     * @param {object} task - task name, status, due date
     * @param {int} projectId 
     * @param {int} taskId 
     * @returns data or error
     */
    static async updateTask (task, projectId, taskId) {
        const { data, error } = await supabase
        .from("Tasks")
        .update(task)
        .eq("project_id", projectId)
        .eq("id", taskId)
        .select()
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    } 

    /**
     * Delete project(s) from the Projects table where id of the given projects match.
     * @param {int} id - project id
     */
    static async deleteProjects (id) {
        const { error } = await supabase
        .from("Projects")
        .delete()
        .eq("id", [id])
        
        if (error) {
            throw error
        }
        else {
            // return 
        }
    } 

    /**
     * Delete a task from the Tasks table where the id of the given task matches.
     * @param {int} id - task id
     * @returns remaining data from the Tasks table
     */
    static async deleteTask (id) {
        const { error } = await supabase
        .from("Tasks")
        .delete()
        .eq("id", [id])

        // Refetch remaining data
        const { newData, newError } = await supabase
        .from("Tasks")
        .select()
        
        if (error || newError) {
            throw error || newError
        }
        else {
            return newData
        }
    } 
}

export default Tasks