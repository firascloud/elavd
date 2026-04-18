import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const CONTACT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || 'template_opj78rh';
const ORDER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID || 'template_ch5664l';

// Initialize EmailJS once
if (typeof window !== 'undefined' && PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

export interface EmailParams {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  message: string;
  confirmation_message?: string | null; // Added for the Thank You text
  total?: number | null;
  items?: string | null;
  product_name?: string | null;
  subject?: string | null;
}

const validateConfig = () => {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    const error = 'EmailJS Configuration Missing: Please check NEXT_PUBLIC_EMAILJS_SERVICE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in your .env file.';
    console.error(error);
    return false;
  }
  return true;
};

export const emailService = {
  /**
   * Sends a contact inquiry email to the admin
   */
  async sendContactEmail(params: EmailParams) {
    if (!validateConfig()) return;

    try {
      return await emailjs.send(
        SERVICE_ID,
        CONTACT_TEMPLATE_ID,
        {
          name: params.name,
          from_name: params.name,
          email: params.email,
          from_email: params.email,
          phone: params.phone,
          message: params.message,
          type: 'CONTACT_ADMIN_NOTIFICATION'
        }
      );
    } catch (error) {
      console.error('EmailJS Contact Error:', error);
      throw error;
    }
  },

  /**
   * Sends an order/quote request notification to the admin
   */
  async sendOrderNotification(params: EmailParams) {
    if (!validateConfig()) return;

    try {
      return await emailjs.send(
        SERVICE_ID,
        ORDER_TEMPLATE_ID,
        {
          name: params.name,
          from_name: params.name,
          email: params.email,
          from_email: params.email,
          phone: params.phone,
          city: params.city,
          message: params.message,
          total: params.total,
          items: params.items,
          product_name: params.product_name,
          type: 'ORDER_ADMIN_NOTIFICATION'
        }
      );
    } catch (error) {
      console.error('EmailJS Order Notification Error:', error);
      throw error;
    }
  },

  /**
   * Sends a confirmation email directly to the customer (Elavd Team Branding)
   */
  async sendCustomerConfirmation(params: EmailParams, customTemplateId?: string) {
    if (!validateConfig()) return;

    try {
      return await emailjs.send(
        SERVICE_ID,
        customTemplateId || ORDER_TEMPLATE_ID,
        {
          from_name: params.name,
          from_email: params.email,
          phone: params.phone,
          city: params.city,
          message: params.message,
          product_name: params.product_name,
          subject: params.subject || 'New Message from Elavd Team',
          type: 'CUSTOMER_CONFIRMATION'
        }
      );
    } catch (error) {
      console.error('EmailJS Customer Confirmation Error:', error);
      throw error;
    }
  }
};

