import supabase from "../../front-end/src/supabase/supabaseClient.js"

/**
 * Model that queries supabase tables for CRUD operations
 */
class Emails {
    /**
     * Fetches data from the Inbox table to show on the client's inbox page
     * @returns data or error
     */
    static async fetchInbox () {
        const { data, error } = await supabase
        .from("Inbox")
        .select("*")
        .order("created_at", { ascending: false })

        if (error) {
            throw error
        }
        else {
            return data
        }
    }
    
    /**
     * Fetches records from Emails table where id in the table is that of the user. To fetch folder data.
     * @param {*} id - user.id
     * @param {string} folder
     * @param {boolean} priority
     * @returns data or error
     */
    static async fetchByFolderOrPriority (id, folder = "", priority = "") {
        if (folder !== ""){
            const { data, error } = await supabase
            .from("Emails")
            .select()
            .eq("user_id", id)
            .eq("folder", folder)
            .order("created_at", {ascending: false})
            
            if (error) {
                throw error
            }
            else {
                return data
            }
        }
        // ⚠️ Also query high-priority mails from Inbox table
        if (priority) {
            const { data, error } = await supabase
            .from("Emails")
            .select()
            .eq("user_id", id)
            .eq("priority", true)
            .order("created_at", {ascending: false})
            
            if (error) {
                throw error
            }
            else {
                return data
            }
        }
    }
    
    /**
     * Insert an email into the Emails table. Fields: send_to, subject, email_body, read, folder (default sent).
     * Used for sent folder and drafts folder.
     * @param {object} email 
     * @returns data or error
     */
    static async insertEmail (email) {
        const { data, error } = await supabase
        .from("Emails")
        .insert(email)
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    }
    
    /**
     * Update folder name of an email when it is changed by the client. Folders: sent, archives, drafts, trash.
     * @param {uuid} id 
     * @param {string} folder 
     * @returns data or error
    */
    static async updateFolderName (id, folder) {
       const { data, error } = await supabase
       .from("Emails")
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

    static async updatePriority (id, value, type = "") {
        if (type === "inbox") {
            const { data, error } = await supabase
            .from("Inbox")
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
        else {
            const { data, error } = await supabase
            .from("Emails")
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
    
    static async markRead (id, value) {
        const { data, error } = await supabase
        .from("Inbox")
        .update({"read": value})
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
     * Delete a record from the inbox table. Needed? the folder can be changed using the update function.
     * @param {uuid} id 
     * @returns data or error
     */
    static async deleteEmail (id) {
       const { data, error } = await supabase
        .from("Emails")
        .delete()
        .in("id", [id])

        // Refetch data without the deleted item
        // const { newData, newError } = await supabase
        // .from("Emails")
        // .select("*")
       
       if (error) {
           throw error
       }
       else {
        //    return newData
       }
    }
}

export default Emails