import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const CONTACT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || 'template_opj78rh';
const ORDER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID || 'template_opj78rh';

export const emailService = {
  /**
   * Sends a contact inquiry email to the admin
   */
  async sendContactEmail(params: any) {
    try {
      return await emailjs.send(
        SERVICE_ID,
        CONTACT_TEMPLATE_ID,
        {
          from_name: params.name,
          from_email: params.email,
          phone: params.phone,
          message: params.message,
        },
        PUBLIC_KEY
      );
    } catch (error) {
      console.error('EmailJS Contact Error:', error);
      throw error;
    }
  },

  /**
   * Sends an order/quote request notification to the admin
   */
  async sendOrderNotification(params: any) {
    try {
      return await emailjs.send(
        SERVICE_ID,
        ORDER_TEMPLATE_ID,
        {
          from_name: params.name,
          from_email: params.email,
          phone: params.phone,
          city: params.city,
          message: params.message,
          total: params.total,
          items: params.items,
          product_name: params.product_name,
          type: 'ADMIN_NOTIFICATION'
        },
        PUBLIC_KEY
      );
    } catch (error) {
      console.error('EmailJS Order Notification Error:', error);
      throw error;
    }
  },

  /**
   * Sends an order confirmation email directly to the customer 
   * (If you have a separate template for customers)
   */
  async sendCustomerConfirmation(params: any, templateId?: string) {
    try {
      return await emailjs.send(
        SERVICE_ID,
        templateId || ORDER_TEMPLATE_ID, // Use customer-specific template if provided
        {
          to_name: params.name,
          to_email: params.email,
          message: params.message,
          product_name: params.product_name,
          type: 'CUSTOMER_CONFIRMATION'
        },
        PUBLIC_KEY
      );
    } catch (error) {
      console.error('EmailJS Customer Confirmation Error:', error);
      throw error;
    }
  }
};
