import { Resend } from 'resend';
import { contactAdminTemplate, contactUserTemplate } from '@/lib/contactTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Send email to Admin
    const adminEmail = await resend.emails.send({
      from: 'Elavd Contact <onboarding@resend.dev>',
      to: [process.env.EMAIL_ADDRESS],
      replyTo: email,
      subject: 'New Contact Message',
      html: contactAdminTemplate({ name, email, phone, message }),
    });

    // 2. Send confirmation email to the user
    const userEmail = await resend.emails.send({
      from: 'Elavd <onboarding@resend.dev>',
      to: [email],
      subject: 'Message Received - Elavd',
      html: contactUserTemplate({ name }),
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
    console.error('Error sending contact email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
