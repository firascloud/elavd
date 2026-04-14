"use server";

import { getServerSupabase } from "@/lib/supabase/server";

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: string;
}

const supabase = getServerSupabase();

export async function sendMessage(data: ContactData) {
  const { data: message, error } = await supabase
    .from('contacts')
    .insert([{
      ...data,
      status: data.status || 'new',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return message;
}

export async function getContacts(options: { 
  search?: string, 
  status?: string, 
  page: number, 
  pageSize: number 
}) {
  const { search, status, page, pageSize } = options;
  let query = supabase
    .from('contacts')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  if (status && status !== "all") {
    query = query.eq('status', status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data, count };
}


export async function updateContactStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('contacts')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}


// Individual exports are used as server actions.



