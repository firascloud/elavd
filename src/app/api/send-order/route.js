import { Resend } from 'resend';
import { adminOrderTemplate, userOrderTemplate } from '@/lib/orderTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message, total, items, productName, quantity } = body;

    // Basic validation
    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Send email to Admin
    const adminEmail = await resend.emails.send({
      from: 'Elavd Orders <onboarding@resend.dev>', // Update this with a verified domain in production
      to: 'mm246344@gmail.com',
      subject: 'New Order Received',
      html: adminOrderTemplate({ name, email, phone, message, total, items, productName, quantity }),
    });

    // 2. Send confirmation email to the user
    const userEmail = await resend.emails.send({
      from: 'Elavd <onboarding@resend.dev>', // Update this with a verified domain in production
      to: email,
      subject: 'Your order has been received',
      html: userOrderTemplate({ name }),
    });

    return new Response(JSON.stringify({ 
      success: true, 
      adminEmailId: adminEmail.id,
      userEmailId: userEmail.id 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
