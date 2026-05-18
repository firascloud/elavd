import { supabaseBrowser } from "@/lib/supabase/client";

export interface OrderItem {
    id?: string;
    product_id?: string;
    name_ar: string;
    name_en: string;
    quantity: number;
    price: number;
    total?: number;
}

export interface OrderData {
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    address?: string;
    notes?: string;
    total: number;
    subtotal: number;
    status?: string;
    payment_method?: string;
}

export const orderService = {
    async createOrder(orderData: OrderData, items: OrderItem[]) {
        const { data: order, error: orderError } = await supabaseBrowser
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (orderError) throw orderError;

        if (items && items.length > 0) {
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product_id || null,
                product_name_ar: item.name_ar,
                product_name_en: item.name_en,
                quantity: item.quantity,
                price: item.price || 0,
                total: (item.price || 0) * item.quantity
            }));

            const { error: itemsError } = await supabaseBrowser
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;
        }

        return order;
    },

    async getOrders() {
        const { data, error } = await supabaseBrowser
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async updateOrderStatus(id: string, status: string) {
        const { data, error } = await supabaseBrowser
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
