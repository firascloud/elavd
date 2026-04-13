export const adminOrderTemplate = ({ name, email, phone, message, total, items, productName, quantity }) => {
  const itemsHtml = items && items.length > 0 
    ? items.map(item => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 16px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${item.name_en || item.name_ar}</td>
          <td style="padding: 16px 0; color: #64748b; font-size: 14px; text-align: center;">${item.quantity}</td>
          <td style="padding: 16px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">${item.price} SAR</td>
        </tr>
      `).join('')
    : `<tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 16px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${productName || 'Product'}</td>
        <td style="padding: 16px 0; color: #64748b; font-size: 14px; text-align: center;">${quantity || 1}</td>
        <td style="padding: 16px 0; color: #0f172a; font-size: 14px; font-weight: 700; text-align: right;">—</td>
      </tr>`;

  return `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 50px 20px;">
    <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); border: 1px solid #e2e8f0;">
      
      <div style="background-color: #0f172a; padding: 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;">New Order Notification</h1>
        <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">Internal System Alert</p>
      </div>

      <div style="padding: 40px;">
        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 12px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 15px; border-left: 4px solid #3b82f6; padding-left: 12px;">Customer Information</h2>
          <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #f1f5f9;">
            <div style="margin-bottom: 12px;">
              <span style="color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px;">Name</span>
              <span style="color: #0f172a; font-size: 16px; font-weight: 700;">${name}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <span style="color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px;">Email</span>
              <span style="color: #2563eb; font-size: 16px; font-weight: 600;">${email}</span>
            </div>
            <div>
              <span style="color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px;">Phone</span>
              <span style="color: #0f172a; font-size: 16px; font-weight: 700;">${phone}</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 35px;">
          <h2 style="font-size: 12px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 15px; border-left: 4px solid #3b82f6; padding-left: 12px;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #0f172a; text-align: left;">
                <th style="padding: 12px 0; color: #0f172a; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em;">Product</th>
                <th style="padding: 12px 0; color: #0f172a; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">Qty</th>
                <th style="padding: 12px 0; color: #0f172a; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 25px; background-color: #0f172a; padding: 24px; border-radius: 16px; text-align: right;">
            <span style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 4px;">Grand Total</span>
            <span style="color: #ffffff; font-size: 24px; font-weight: 900;">${total ? total + ' SAR' : 'QUOTE REQUESTED'}</span>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 12px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 15px; border-left: 4px solid #3b82f6; padding-left: 12px;">Additional Instructions</h2>
          <div style="background-color: #fffbeb; padding: 24px; border-radius: 16px; border: 1px solid #fef3c7; color: #92400e; font-size: 15px; line-height: 1.6;">
            ${message || 'No additional requirements provided.'}
          </div>
        </div>

        <div style="border-top: 1px solid #f1f5f9; margin-top: 40px; padding-top: 20px; text-align: center;">
          <p style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
            Elavd Automated Notification System
          </p>
        </div>
      </div>
    </div>
  </div>
  `;
};

export const userOrderTemplate = ({ name }) => {
  return `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 50px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); border: 1px solid #e2e8f0;">
      
      <div style="background-color: #3b82f6; height: 8px;"></div>
      
      <div style="padding: 45px 40px;">
        <div style="text-align: center; margin-bottom: 35px;">
           <h1 style="color: #0f172a; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.02em;">We've received your order!</h1>
           <p style="color: #64748b; font-size: 15px; margin-top: 8px; font-weight: 500;">Thank you for choosing Elavd.</p>
        </div>

        <div style="background-color: #f1f5f9; height: 1px; width: 100%; margin-bottom: 35px;"></div>

        <p style="color: #0f172a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Dear <strong>${name}</strong>,
        </p>

        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
          Your request has been successfully submitted to our team. We are currently reviewing the details and one of our specialists will contact you very soon to finalize the next steps.
        </p>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 16px; margin-bottom: 35px;">
          <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">
            Verification Complete
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #f1f5f9;">
          <p style="color: #0f172a; font-size: 14px; font-weight: 800; margin: 0;">Best regards,</p>
          <p style="color: #3b82f6; font-size: 16px; font-weight: 900; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.1em;">The Elavd Team</p>
        </div>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; text-align: center;">
        <p style="font-size: 11px; color: #94a3b8; font-weight: 600; margin: 0;">
          This is an automated message, please do not reply.
        </p>
      </div>
    </div>
  </div>
  `;
};
