import supabase from "../../front-end/src/supabase/supabaseClient.js"

/** 
 * Model to check if correct data, 
 * and its type are being passed to the database.
 * Supabase is RESTFul so maybe wouldn't need this
*/ 
const EmailSchema_x = {
    // field: {
    //     type: type,
    //     required: true,
    //     default: true/false/optional -- false for delelte, true for trash
    // }
}

/**
 * Model that queries supabase tables for CRUD operations
 */
class Emails {
    /**
     * Fetches data from the Inbox table to show on the client's inbox page
     * @returns data or error
     */
    static async fetchInbox () {
        const {data, error} = await supabase
        .from("Inbox")
        .select("*")

        if(error){
            console.log(error)
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
    static async fetchByFolderOrPriority (id, folder = "", priority = false) {
        if (folder !== ""){
            const { data, error } = await supabase
            .from("Emails")
            .select()
            .eq("user_id", id)
            .eq("folder", folder)
            
            if(error){
                throw error
            }
            else {
                return data
            }
        }
        if (priority){
            const { data, error } = await supabase
            .from("Emails")
            .select()
            .eq("user_id", id)
            .eq("priority", true)
            
            if(error){
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
        
        if(error){
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
       
       if(error){
           throw error
       }
       else {
           return data
       }
    }

    static async updatePriority (id, value) {
       const { data, error } = await supabase
       .from("Emails")
       .update({"priority": value})
       .in("id", id)
       .select()
       
       if(error){
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
       
       if(error){
           throw error
       }
       else {
        //    return newData
       }
    }
}

export default Emails