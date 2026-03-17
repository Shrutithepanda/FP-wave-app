import supabase from "../../front-end/src/supabase/supabaseClient.js"

/**
 * Model that queries Supabase database for CRUD operations on Inbox and Emails tables
 */
class Emails {
    /**
     * Fetch data from the Inbox table to show on the client's inbox page.
     * @returns data, ordered according to the time they were created at, or error
     */
    static async fetchInbox () {
        const { data, error } = await supabase
        .from("Inbox")
        .select()
        .eq("folder", "inbox")
        .order("created_at", { ascending: false })

        if (error) {
            throw error
        }
        else {
            return data
        }
    }
    
    /**
     * Fetch records from the Emails or Inbox table according to folder name.
     * @param {uuid} id - user_id
     * @param {string} folder - default empty
     * @returns data or error
     */
    static async fetchByFolder (id, folder = "") {
        if (folder){
            if (folder === "archives") {
                const { data, error } = await supabase
                .from("Inbox")
                .select()
                .eq("folder", folder)
                .order("created_at", { ascending: false })
                
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
                .select()
                .eq("user_id", id)
                .eq("folder", folder)
                .order("created_at", { ascending: false })
                
                if (error) {
                    throw error
                }
                else {
                    return data
                }
            }
        }
    }

    /**
     * Fetch emails from Emails table where user_id matches that of the current user and priority is true.
     * @param {uuid} id - user_id
     * @returns data or error
     */
    static async fetchByPriorityFromEmails (id, value) {
        const { data, error } = await supabase
        .from("Emails")
        .select()
        .eq("user_id", id)
        .eq("priority", value)
        .order("created_at", { ascending: false })
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    }

    /**
     * Fetch emails from Inbox table where priority is true.
     * @returns data or error
     */
    static async fetchByPriorityFromInbox (value) {
        const { data, error } = await supabase
        .from("Inbox")
        .select()
        .eq("priority", value)
        .order("created_at", { ascending: false })
        
        if (error) {
            throw error
        }
        else {
            return data
        }
    }
    
    /**
     * Insert an email into the Emails table.
     * Used for sent folder and drafts folder.
     * @param {object} email - send_to, subject, email_body, read, folder (default sent)
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
     * Update folder name of an email when it is changed by the client.
     * @param {int} id - id of the email
     * @param {string} folder - sent, archives, drafts, trash
     * @returns data or error
    */
    static async updateFolderName (id, folder) {
       const { data, error } = await supabase
       .from("Emails")
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
     * Update the priority property of the emails in both Emails and Inbox tables based on the param type.
     * @param {int} id - id of the email
     * @param {boolean} value - priority
     * @param {string} type - folder name
     * @returns 
     */
    static async updatePriority (id, value, type = "") {
        if (type === "inbox") {
            const { data, error } = await supabase
            .from("Inbox")
            .update({ "priority": value })
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
            .update({ "priority": value })
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
    
    /**
     * Delete matching records from the Emails table.
     * @param {int} id 
     * @returns error if it occured
     */
    static async deleteEmail (id) {
       const { error } = await supabase
        .from("Emails")
        .delete()
        .in("id", [id])
       
       if (error) {
           throw error
       }
       else {
        //    return 
       }
    }

    /**
     * Update the read property of rows matching the given id, if they are unread in the Inbox table.
     * @param {int} id - id of the email
     * @param {boolean} value - read
     * @returns data or error
     */
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
     * Update folder name of requested emails to the requested value 
     * @param {*} id - emails
     * @param {*} folder - Archives or others
     * @returns data or error
     */
    static async archiveEmails (id, folder) {
        const { data, error } = await supabase
       .from("Inbox")
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
}

export default Emails