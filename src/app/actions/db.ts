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

export async function deleteProductAction(id: string) {
    const supabase = getServerSupabase();
    
    // 1. Unlink from order_items (set product_id to null)
    // This preserves order history while allowing product deletion
    await supabase
        .from('order_items')
        .update({ product_id: null })
        .eq('product_id', id);

    // 2. Delete the product
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error("Error deleting product:", error);
        throw new Error(error.message);
    }
    return true;
}

export async function deleteCategoryAction(id: string) {
    const supabase = getServerSupabase();
    
    // 1. Unlink products from this category instead of deleting them
    await supabase
        .from('products')
        .update({ category_id: null, sub_category_id: null })
        .eq('category_id', id);

    // 2. Delete the category
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error("Error deleting category:", error);
        throw new Error(error.message);
    }
    return true;
}

export async function deleteSubCategoryAction(id: string) {
    const supabase = getServerSupabase();
    
    // 1. Unlink products from this sub-category
    await supabase
        .from('products')
        .update({ sub_category_id: null })
        .eq('sub_category_id', id);

    // 2. Delete the sub-category
    const { error } = await supabase
        .from('sub_categories')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error("Error deleting sub-category:", error);
        throw new Error(error.message);
    }
    return true;
}
