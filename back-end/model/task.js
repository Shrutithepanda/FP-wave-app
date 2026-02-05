import supabase from "../../front-end/src/supabase/supabaseClient.js"

/**
 * Model that queries supabase tables for CRUD operations
 */
class Tasks {
    static async fetchProjects () {
        const { data, error } = await supabase
        .from("Projects")
        .select("*")
        .order("due_date", { ascending: false })

        if (error) {
            throw error
        }
        else {
            return data
        }
    }

    static async updateFolderName (id, folder) {
       const { data, error } = await supabase
       .from("Projects")
       .update({"folder": folder})
       .in("id", id)
       .select()
       
       if (error) {
           throw error
       }
       else {
           return data
       }
    }

    static async updatePriority (id, value) {
        const { data, error } = await supabase
        .from("Projects")
        .update({"priority": value})
        .in("id", id)
        .select()
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    }
}

export default Tasks