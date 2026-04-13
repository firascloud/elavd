import { supabaseBrowser } from "@/lib/supabase/client";

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: string;
}

export const contactService = {
  async sendMessage(data: ContactData) {
    const { data: message, error } = await supabaseBrowser
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
  },

  async getContacts() {
    const { data, error } = await supabaseBrowser
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateContactStatus(id: string, status: string) {
    const { data, error } = await supabaseBrowser
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
