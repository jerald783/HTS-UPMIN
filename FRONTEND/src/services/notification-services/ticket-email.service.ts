// import { Injectable } from '@angular/core';
// import { Observable, switchMap } from 'rxjs';
// import { EmailService } from './email.service';
// import { UserService } from '../UserServices/user.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class TicketEmailService {
//   constructor(
//     private emailService: EmailService,
//     private userService: UserService,
//   ) {}

//   sendUserCredentialsEmail(user: any) {
//     if (!user.email) return;

//     const payload = {
//       // CUSTOMER EMAIL
//       to: user.email,

//       subject: `🔐 Your Account Credentials`,

//       body: `
// <div class="font-sans bg-slate-100 py-10 px-5" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f9; padding-top: 40px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px;">

//   <div class="max-w-xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-200" style="max-width: 600px; margin-left: auto; margin-right: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

//     <div class="bg-blue-600 text-white p-6 text-center" style="background-color: #2563eb; color: #ffffff; padding: 25px; text-align: center;">
//       <h2 class="text-xl font-bold" style="margin: 0; font-size: 1.25rem; font-weight: 700;">🔐 Account Created Successfully</h2>
//     </div>

//     <div class="p-7.5" style="padding: 30px; color: #374151;">

//       <p class="text-base" style="font-size: 1rem; line-height: 1.5rem;">Hello <strong class="font-bold" style="font-weight: 700;">${user.name}</strong>,</p>

//       <p class="text-sm mt-2" style="font-size: 0.875rem; line-height: 1.25rem; margin-top: 8px;">Your account has been created. Below are your login credentials:</p>

//       <div class="bg-slate-100 p-5 rounded-lg my-5" style="background-color: #f1f5f9; padding: 20px; border-radius: 10px; margin-top: 20px; margin-bottom: 20px;">
//         <p class="text-sm" style="font-size: 0.875rem; line-height: 1.5rem; margin: 0 0 8px 0;"><strong class="font-semibold" style="font-weight: 600;">Username:</strong> ${user.username}</p>
//         <p class="text-sm" style="font-size: 0.875rem; line-height: 1.5rem; margin: 0;"><strong class="font-semibold" style="font-weight: 600;">Password:</strong> ${user.password}</p>
//       </div>

//       <p class="text-blue-600 leading-relaxed text-sm my-4" style="color: #2563eb; line-height: 1.6; font-size: 0.875rem;">
//         Please use the credentials above to access the Wi-Fi service.
//       </p>

//       <p class="text-sm mt-6" style="font-size: 0.875rem; margin-top: 24px;">Regards,<br><strong class="font-bold" style="font-weight: 700;">IT Support Team</strong></p>

//     </div>

//     <div class="bg-slate-100 text-center p-2.5 text-xs text-gray-500" style="background-color: #f1f5f9; text-align: center; padding: 10px; font-size: 12px; color: #6b7280;">
//       System Generated Email
//     </div>

//   </div>
// </div>
// `,
//     };

//     this.emailService.sendEmail(payload).subscribe();
//   }

//   sendTicketNotification(form: any): Observable<any> {
//     const ticketNo = form.ticketNumber;
//     const name = form.fullName;

//     return this.userService.getAgents().pipe(
//       switchMap((agents: string[]) => {
//         const payload = {
//           // =========================================
//           // CUSTOMER EMAIL (Light Theme - Tailwind Blue)
//           // =========================================
//           to: form.email,

//           subject: `🎫 Ticket Confirmation #${ticketNo}`,

//           body: `
// <div class="font-sans bg-blue-50 py-10 px-5" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #eef4ff; padding-top: 40px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px;">

//   <div class="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden border border-blue-100" style="max-width: 620px; margin-left: auto; margin-right: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dbeafe;">

//     <div class="bg-blue-600 p-7.5 text-center text-white" style="background-color: #2563eb; padding: 30px; text-align: center; color: #ffffff;">

//       <div class="text-5xl" style="font-size: 50px; line-height: 1;">
//         🎫
//       </div>

//       <h1 class="mt-2.5 text-2xl font-bold" style="margin-top: 10px; margin-bottom: 0; font-size: 24px; font-weight: 700;">
//         Ticket Received
//       </h1>

//       <p class="mt-2 text-white/90 text-sm" style="margin-top: 8px; opacity: 0.9; font-size: 14px;">
//         Customer Support Confirmation
//       </p>

//     </div>

//     <div class="p-9 text-gray-700" style="padding: 35px; color: #374151;">

//       <p class="text-base" style="font-size: 16px;">
//         Hello <strong class="font-bold" style="font-weight: 700;">${name}</strong>,
//       </p>

//       <p class="text-sm leading-relaxed mt-2" style="line-height: 1.7; font-size: 14px; margin-top: 8px;">
//         We successfully received your support request.
//         Our IT team will review your concern and contact you as soon as possible.
//       </p>

//       <div class="my-7.5 bg-slate-50 border-2 border-dashed border-blue-600 rounded-xl p-5 text-center" style="background-color: #f8fafc; border: 2px dashed #2563eb; border-radius: 12px; padding: 20px; text-align: center; margin-top: 30px; margin-bottom: 30px;">

//         <div class="text-xs text-gray-500 font-semibold tracking-wider" style="font-size: 13px; color: #6b7280; font-weight: 600; letter-spacing: 0.05em;">
//           YOUR TICKET NUMBER
//         </div>

//         <div class="mt-2 text-3xl font-bold text-blue-600 tracking-wide" style="font-size: 28px; font-weight: 700; color: #2563eb; margin-top: 8px; letter-spacing: 1px;">
//           ${ticketNo}
//         </div>

//       </div>

//       <div class="bg-blue-50 border-l-4 border-blue-600 p-3.5 rounded text-xs leading-relaxed text-blue-900" style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #1e3a8a;">
//         Please keep your ticket number for tracking and follow-up purposes.
//       </div>

//       <div class="mt-6 bg-gray-50 rounded-ec border border-gray-200 p-4.5" style="margin-top: 25px; background-color: #f9fafb; border-radius: 10px; padding: 18px; border: 1px solid #e5e7eb;">

//         <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 14px;">

//           <tr>
//             <td class="py-2 text-gray-500" style="padding-top: 8px; padding-bottom: 8px; color: #6b7280;">
//               Priority
//             </td>
//             <td class="py-2 text-right text-gray-900 font-medium" style="padding-top: 8px; padding-bottom: 8px; text-align: right; color: #111827; font-weight: 500;">
//               ${form.PriorityLevel}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-2 text-gray-500" style="padding-top: 8px; padding-bottom: 8px; color: #6b7280;">
//               Help Topic
//             </td>
//             <td class="py-2 text-right text-gray-900 font-medium" style="padding-top: 8px; padding-bottom: 8px; text-align: right; color: #111827; font-weight: 500;">
//               ${form.HelpTopic}
//             </td>
//           </tr>

//         </table>

//       </div>

//       <p class="mt-9 text-sm" style="margin-top: 35px; font-size: 14px;">
//         Thank you,<br>
//         <strong class="font-bold text-gray-900" style="font-weight: 700; color: #111827;">IT Support Team</strong>
//       </p>

//     </div>

//     <div class="bg-gray-50 text-center p-3.5 text-xs text-gray-400" style="background-color: #f9fafb; text-align: center; padding: 15px; font-size: 12px; color: #9ca3af;">
//       Automated Email • Customer Copy
//     </div>

//   </div>
// </div>
// `,

//           // =========================================
//           // AGENT EMAIL (Dark Theme - Tailwind Red/Slate)
//           // =========================================
//           agents: agents,

//           agentSubject: `🚨 New Ticket #${ticketNo}`,

//           agentBody: `
// <div class="font-mono bg-slate-900 p-7.5" style="font-family: Consolas, Monaco, monospace, ui-sans-serif; background-color: #111827; padding: 30px;">

//   <div class="max-w-3xl mx-auto bg-gray-800 rounded-xl overflow-hidden border border-gray-700" style="max-width: 760px; margin-left: auto; margin-right: auto; background-color: #1f2937; border-radius: 14px; overflow: hidden; border: 1px solid #374151;">

//     <div class="bg-red-600 text-white py-5.5 px-7.5" style="background-color: #dc2626; color: #ffffff; padding-top: 22px; padding-bottom: 22px; padding-left: 30px; padding-right: 30px;">

//       <div class="text-xs font-semibold tracking-wider opacity-90" style="font-size: 13px; letter-spacing: 1px; color: #ffffff; opacity: 0.9;">
//         INTERNAL IT NOTIFICATION
//       </div>

//       <h2 class="mt-2 text-xl font-bold" style="margin-top: 8px; margin-bottom: 0; font-size: 20px; font-weight: 700;">
//         🚨 NEW SUPPORT TICKET
//       </h2>

//     </div>

//     <div class="p-7.5 text-gray-100" style="padding: 30px; color: #f3f4f6;">

//       <div class="bg-slate-900 rounded-lg p-4.5 mb-6 border border-gray-700" style="background-color: #111827; border-radius: 10px; padding: 18px; margin-bottom: 25px; border: 1px solid #374151;">

//         <div class="text-gray-400 text-xs" style="font-size: 12px; color: #9ca3af;">
//           Ticket Reference
//         </div>

//         <div class="mt-1 text-2xl font-bold text-blue-400" style="font-size: 26px; font-weight: 700; color: #60a5fa; margin-top: 5px;">
//           ${ticketNo}
//         </div>

//       </div>

//       <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 14px;">

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Requestor
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${name}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Email
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${form.email}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Priority
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">

//             <span class="bg-red-950 text-red-200 px-3 py-1.5 rounded-full text-xs font-bold" style="background-color: #7f1d1d; color: #fecaca; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: bold;">
//               ${form.PriorityLevel}
//             </span>

//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Help Topic
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${form.HelpTopic}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Details
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100 leading-relaxed" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6; line-height: 1.7;">
//             ${form.details}
//           </td>
//         </tr>

//       </table>

//       <div class="mt-7 bg-slate-900 border-l-4 border-red-600 p-4.5 rounded-lg text-gray-300 leading-relaxed text-xs" style="margin-top: 28px; background-color: #111827; border-left: 4px solid #dc2626; padding: 18px; border-radius: 8px; color: #d1d5db; line-height: 1.7; font-size: 13px;">
//         Immediate review and assignment is required.
//       </div>

//       <p class="mt-7 text-gray-400 text-xs" style="margin-top: 28px; color: #9ca3af; font-size: 13px;">
//         Please login to the Helpdesk System to process this request.
//       </p>

//     </div>

//     <div class="bg-slate-900 p-3.5 text-center text-xs text-gray-500" style="background-color: #111827; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
//       Internal Helpdesk Notification • IT Department
//     </div>

//   </div>
// </div>
// `,
//         };

//         return this.emailService.sendEmail(payload);
//       }),
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { EmailService } from './email.service';
import { UserService } from '../UserServices/user.service';

@Injectable({
  providedIn: 'root',
})
export class TicketEmailService {
  constructor(
    private emailService: EmailService,
    private userService: UserService,
  ) {}

  sendUserCredentialsEmail(user: any) {
    if (!user.email) return;

    const payload = {
      to: user.email,
      subject: `🔐 Your Account Credentials`,
      body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 10px !important; }
      .content-padding { padding: 20px 15px !important; }
      .header-padding { padding: 20px 15px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td class="header-padding" align="center" style="background-color: #2563eb; padding: 25px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 700;">🔐 Account Created Successfully</h2>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding: 30px; color: #374151;">
              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.5;">Hello <strong style="font-weight: 700;">${user.name}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.5;">Your account has been created. Below are your login credentials:</p>
              
              <!-- Credentials Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; border-radius: 10px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.5;"><strong style="font-weight: 600;">Username:</strong> ${user.username}</p>
                    <p style="margin: 0; font-size: 14px; line-height: 1.5;"><strong style="font-weight: 600;">Password:</strong> ${user.password}</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; color: #2563eb; line-height: 1.6; font-size: 14px;">
                Please use the credentials above to access the Wi-Fi service.
              </p>

              <p style="margin: 0; font-size: 14px; line-height: 1.5;">Regards,<br><strong style="font-weight: 700;">IT Support Team</strong></p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f1f5f9; padding: 12px; font-size: 12px; color: #6b7280;">
              System Generated Email
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    };

    this.emailService.sendEmail(payload).subscribe();
  }

  sendTicketNotification(form: any): Observable<any> {
    const ticketNo = form.ticketNumber;
    const name = form.fullName;

    return this.userService.getAgents().pipe(
      switchMap((agents: string[]) => {
        const payload = {
          // =========================================
          // CUSTOMER EMAIL (Light Theme)
          // =========================================
          to: form.email,
          subject: `🎫 Ticket Confirmation #${ticketNo}`,
          body: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 10px !important; }
      .content-padding { padding: 20px 15px !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; text-align: left !important; }
      .stack-column-right { display: block !important; width: 100% !important; max-width: 100% !important; text-align: left !important; padding-top: 4px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #eef4ff; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #eef4ff; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dbeafe; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #2563eb; padding: 30px 20px; color: #ffffff;">
              <div style="font-size: 48px; line-height: 1;">🎫</div>
              <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700;">Ticket Received</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Customer Support Confirmation</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td class="content-padding" style="padding: 35px; color: #374151;">
              <p style="margin: 0; font-size: 16px;">Hello <strong style="font-weight: 700;">${name}</strong>,</p>
              <p style="margin: 8px 0 25px 0; line-height: 1.7; font-size: 14px;">
                We successfully received your support request. Our IT team will review your concern and contact you as soon as possible.
              </p>

              <!-- Ticket Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 2px dashed #2563eb; border-radius: 12px; margin-bottom: 25px;">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <div style="font-size: 12px; color: #6b7280; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">YOUR TICKET NUMBER</div>
                    <div style="font-size: 28px; font-weight: 700; color: #2563eb; margin-top: 6px; letter-spacing: 1px;">${ticketNo}</div>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #1e3a8a; margin-bottom: 25px;">
                Please keep your ticket number for tracking and follow-up purposes.
              </div>

              <!-- Details Table -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 15px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
                      <tr>
                        <td class="stack-column" style="padding: 8px 0; color: #6b7280; width: 40%;">Priority</td>
                        <td class="stack-column-right" style="padding: 8px 0; text-align: right; color: #111827; font-weight: 500;">${form.PriorityLevel}</td>
                      </tr>
                      <tr>
                        <td class="stack-column" style="padding: 8px 0; color: #6b7280; width: 40%;">Help Topic</td>
                        <td class="stack-column-right" style="padding: 8px 0; text-align: right; color: #111827; font-weight: 500;">${form.HelpTopic}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.5;">
                Thank you,<br>
                <strong style="font-weight: 700; color: #111827;">IT Support Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f9fafb; padding: 15px; font-size: 12px; color: #9ca3af;">
              Automated Email • Customer Copy
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,

          // =========================================
          // AGENT EMAIL (Dark Theme)
          // =========================================
          agents: agents,
          agentSubject: `🚨 New Ticket #${ticketNo}`,
          agentBody: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 10px !important; }
      .content-padding { padding: 20px 15px !important; }
      .stack-cell { display: block !important; width: 100% !important; box-sizing: border-box; }
      .stack-label { padding-bottom: 2px !important; color: #9ca3af !important; }
      .stack-value { padding-bottom: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #111827; font-family: Consolas, Monaco, monospace, ui-sans-serif, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 760px; width: 100%; background-color: #1f2937; border-radius: 14px; overflow: hidden; border: 1px solid #374151; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="background-color: #dc2626; color: #ffffff; padding: 22px 25px;">
              <div style="font-size: 12px; font-weight: 600; letter-spacing: 1px; opacity: 0.9;">INTERNAL IT NOTIFICATION</div>
              <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700;">🚨 NEW SUPPORT TICKET</h2>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding: 30px; color: #f3f4f6;">
              <!-- Ref Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border-radius: 10px; border: 1px solid #374151; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 18px;">
                    <div style="font-size: 12px; color: #9ca3af;">Ticket Reference</div>
                    <div style="font-size: 26px; font-weight: 700; color: #60a5fa; margin-top: 5px;">${ticketNo}</div>
                  </td>
                </tr>
              </table>

              <!-- Details Grid -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; word-break: break-word;">
                <tr>
                  <td class="stack-cell stack-label" style="padding: 12px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Requestor</td>
                  <td class="stack-cell stack-value" style="padding: 12px; border-bottom: 1px solid #374151; color: #f3f4f6;">${name}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 12px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Email</td>
                  <td class="stack-cell stack-value" style="padding: 12px; border-bottom: 1px solid #374151; color: #f3f4f6;">${form.email}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 12px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Priority</td>
                  <td class="stack-cell stack-value" style="padding: 12px; border-bottom: 1px solid #374151; color: #f3f4f6;">
                    <span style="background-color: #7f1d1d; color: #fecaca; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: bold; display: inline-block;">
                      ${form.PriorityLevel}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 12px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Help Topic</td>
                  <td class="stack-cell stack-value" style="padding: 12px; border-bottom: 1px solid #374151; color: #f3f4f6;">${form.HelpTopic}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 12px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Details</td>
                  <td class="stack-cell stack-value" style="padding: 12px; border-bottom: 1px solid #374151; color: #f3f4f6; line-height: 1.6;">${form.details}</td>
                </tr>
              </table>

              <div style="margin-top: 25px; background-color: #111827; border-left: 4px solid #dc2626; padding: 16px; border-radius: 8px; color: #d1d5db; line-height: 1.6; font-size: 13px;">
                Immediate review and assignment is required.
              </div>

              <p style="margin: 25px 0 0 0; color: #9ca3af; font-size: 13px;">
                Please login to the Helpdesk System to process this request.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #111827; padding: 15px; font-size: 12px; color: #6b7280;">
              Internal Helpdesk Notification • IT Department
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
        };

        return this.emailService.sendEmail(payload);
      }),
    );
  }
}
