export type UserRow = {
    id: string
    email: string
    name: string | null
    role: 'admin' | 'user'
    created_at: string
}

export type CategoryRow = {
    id: string
    slug: string
    name_en: string
    name_ar: string
    seo_title?: string | null
    seo_description?: string | null
    image?: string | null
    created_at: string
}

export type ProductRow = {
    id: string
    sku: string
    name_en: string
    name_ar: string
    description_en?: string | null
    description_ar?: string | null
    price: number
    category_id?: string | null
    featured?: boolean
    popular?: boolean
    event?: boolean
    image?: string | null
    created_at: string
}

export type OrderItemRow = {
    id: string
    order_id: string
    product_id: string
    quantity: number
    price: number
}

export type OrderRow = {
    id: string
    user_id: string | null
    status: 'pending' | 'shipped' | 'delivered'
    total: number
    customer_name?: string | null
    customer_email?: string | null
    created_at: string
}

export type OfferRow = {
    id: string
    title_en: string
    title_ar: string
    link?: string | null
    image?: string | null
    seo_title?: string | null
    seo_description?: string | null
    created_at: string
}

export type CouponRow = {
    id: string
    code: string
    type: 'percent' | 'fixed'
    value: number
    expires_at?: string | null
    active: boolean
    created_at: string
}

