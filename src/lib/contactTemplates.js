export const contactAdminTemplate = ({ name, email, phone, message }) => {
  return `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 50px 20px;">
    <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
      
      <div style="background-color: #0f172a; padding: 35px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">Contact Form Submission</h1>
      </div>

      <div style="padding: 40px;">
        <div style="margin-bottom: 30px;">
          <div style="display: table; width: 100%; margin-bottom: 12px;">
            <div style="display: table-cell; width: 33%; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Sender Name</div>
            <div style="display: table-cell; color: #0f172a; font-size: 15px; font-weight: 700; text-align: right;">${name}</div>
          </div>
          <div style="display: table; width: 100%; margin-bottom: 12px;">
            <div style="display: table-cell; width: 33%; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Email Address</div>
            <div style="display: table-cell; color: #2563eb; font-size: 15px; font-weight: 600; text-align: right;">${email}</div>
          </div>
          <div style="display: table; width: 100%;">
            <div style="display: table-cell; width: 33%; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Phone Number</div>
            <div style="display: table-cell; color: #0f172a; font-size: 15px; font-weight: 700; text-align: right;">${phone}</div>
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 30px; border-radius: 20px; border: 1px solid #f1f5f9; position: relative;">
          <h3 style="margin: 0 0 15px; font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Message Content</h3>
          <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.7;">${message}</p>
        </div>

        <div style="margin-top: 40px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 25px;">
          <p style="font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;">Direct Website Inquiry</p>
        </div>
      </div>
    </div>
  </div>
  `;
};

export const contactUserTemplate = ({ name }) => {
  return `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 50px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
      
      <div style="padding: 45px 40px; text-align: center;">
        <h1 style="color: #0f172a; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.01em;">Thank you for reaching out!</h1>
        <p style="color: #64748b; font-size: 15px; margin: 10px 0 35px; font-weight: 500;">We've received your message successfully.</p>
        
        <div style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 35px;">
          Message Logged
        </div>

        <p style="color: #475569; font-size: 15px; line-height: 1.6; text-align: left; margin: 0 0 20px;">
          Hi <strong>${name}</strong>,
        </p>

        <p style="color: #475569; font-size: 15px; line-height: 1.6; text-align: left; margin-bottom: 40px;">
          We appreciate you contacting us. Our team is currently reviewing your message and we will get back to you through your provided email or phone number as soon as possible.
        </p>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 30px;">
          <p style="color: #0f172a; font-size: 14px; font-weight: 800; margin: 0;">Warm regards,</p>
          <p style="color: #0f172a; font-size: 18px; font-weight: 900; margin: 5px 0 0; text-transform: uppercase; letter-spacing: 0.05em;">Elavd Team</p>
        </div>
      </div>
    </div>
  </div>
  `;
};
