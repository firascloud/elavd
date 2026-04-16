import { Resend } from 'resend';
import { adminOrderTemplate, userOrderTemplate } from '@/lib/orderTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, city, message, total, items, productName, quantity } = body;

    // Basic validation
    if (!name || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Send email to Admin
    const adminEmail = await resend.emails.send({
      from: 'Elavd Orders <onboarding@resend.dev>',
      to: [process.env.EMAIL_ADDRESS],
      replyTo: email,
      subject: 'New Quote Request Received',
      html: adminOrderTemplate({ name, email, phone, city, message, total, items, productName, quantity }),
    });

    // 2. Send confirmation email to the user
    const userEmail = await resend.emails.send({
      from: 'Elavd <onboarding@resend.dev>',
      to: [email], // Ensure it goes to the customer's email provided in the form
      subject: 'Your request has been received',
      html: userOrderTemplate({ name, items, productName, quantity }),
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
