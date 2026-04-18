"use server";

import { getServerSupabase } from "@/lib/supabase/server";

export async function updateRecord(table: string, data: any, id: string) {
    const supabase = getServerSupabase();
    console.log(`Updating ${table} with ID ${id}`);
    const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error(`Error updating ${table}:`, error);
        throw new Error(error.message);
    }
    return result;
}

export async function insertRecord(table: string, data: any) {
    const supabase = getServerSupabase();
    console.log(`Inserting into ${table}`);
    const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single();
    
    if (error) {
        console.error(`Error inserting into ${table}:`, error);
        throw new Error(error.message);
    }
    return result;
}

export async function deleteRecord(table: string, id: string) {
    const supabase = getServerSupabase();
    console.log(`Deleting from ${table} with ID ${id}`);
    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw new Error(error.message);
    }
    return true;
}
