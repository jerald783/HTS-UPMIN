// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { EmailService } from './email.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class ApproveZoomEmailService {
//   constructor(private emailService: EmailService) {}

//   sendStatusEmail(schedule: any, newStatus: string): Observable<any> {
//     const isApproved = newStatus === 'Approved';

//     const subject = `📅 Zoom Request ${newStatus}: ${schedule.ActivityName}`;

//     // ============================================
//     // DYNAMIC TAILWIND UI CONFIG
//     // ============================================
//     const statusBgColor = isApproved ? '#16a34a' : '#dc2626'; // bg-green-600 : bg-red-600
//     const statusBoxBg = isApproved ? '#ecfdf5' : '#fef2f2'; // bg-green-50 : bg-red-50
//     const statusBoxText = isApproved ? '#16a34a' : '#dc2626'; // text-green-600 : text-red-600

//     const statusIcon = isApproved ? '✅' : '❌';

//     const statusTitle = isApproved
//       ? 'Zoom Request Approved'
//       : 'Zoom Request Rejected';

//     const statusMessage = isApproved
//       ? 'Your Zoom meeting request has been approved successfully.'
//       : 'Unfortunately, your Zoom meeting request was not approved.';

//     const body = `
// <div class="font-sans bg-slate-100 py-10 px-5" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; padding-top: 40px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px;">

//   <div class="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200" style="max-width: 42rem; margin-left: auto; margin-right: auto; background-color: #ffffff; border-radius: 1rem; overflow: hidden; border: 1px solid #e5e7eb;">

//     <div class="text-center p-8 text-white" style="background-color: ${statusBgColor}; text-align: center; padding: 32px; color: #ffffff;">

//       <div class="text-5xl" style="font-size: 3rem; line-height: 1;">
//         ${statusIcon}
//       </div>

//       <h1 class="mt-3 text-2xl font-bold" style="margin-top: 12px; margin-bottom: 0; font-size: 1.5rem; line-height: 2rem; font-weight: 700;">
//         ${statusTitle}
//       </h1>

//       <p class="mt-2 text-white/90 text-sm" style="margin-top: 8px; opacity: 0.9; font-size: 0.875rem; line-height: 1.25rem;">
//         Zoom Schedule Status Update
//       </p>

//     </div>

//     <div class="p-9 text-gray-700" style="padding: 36px; color: #374151;">

//       <p class="text-base" style="font-size: 1rem; line-height: 1.5rem;">
//         Hello <strong class="font-semibold" style="font-weight: 600;">${schedule.RequesterName}</strong>,
//       </p>

//       <p class="text-sm leading-relaxed" style="font-size: 0.875rem; line-height: 1.625;">
//         ${statusMessage}
//       </p>

//       <div class="my-7 border-2 border-dashed rounded-xl p-6 text-center" style="margin-top: 28px; margin-bottom: 28px; background-color: ${statusBoxBg}; border: 2px dashed ${statusBgColor}; border-radius: 0.75rem; padding: 24px; text-align: center;">

//         <div class="text-xs font-semibold tracking-wider text-gray-500" style="font-size: 0.75rem; line-height: 1rem; font-weight: 600; letter-spacing: 0.05em; color: #6b7280;">
//           CURRENT REQUEST STATUS
//         </div>

//         <div class="mt-2.5 text-3xl font-extrabold" style="margin-top: 10px; font-size: 1.875rem; line-height: 2.25rem; font-weight: 800; color: ${statusBoxText};">
//           ${newStatus.toUpperCase()}
//         </div>

//       </div>

//       <div class="bg-gray-50 border border-gray-200 rounded-xl p-5" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 20px;">

//         <div class="text-sm font-semibold mb-4 text-gray-900" style="font-size: 0.875rem; font-weight: 600; margin-bottom: 16px; color: #111827;">
//           📅 Meeting Information
//         </div>

//         <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 0.875rem; line-height: 1.25rem;">

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Topic
//             </td>
//             <td class="py-3 text-right font-semibold" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: ${statusBoxText}; font-weight: 600;">
//               ${schedule.ActivityName}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Setup Type
//             </td>
//             <td class="py-3 text-right text-gray-900" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827;">
//               ${schedule.SetupType}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Date
//             </td>
//             <td class="py-3 text-right text-gray-900" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827;">
//               ${schedule.StartDate}
//               ${schedule.EndDate ? ' → ' + schedule.EndDate : ''}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Time
//             </td>
//             <td class="py-3 text-right text-gray-900" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827;">
//               ${schedule.TimeStart} - ${schedule.TimeEnd}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Requester
//             </td>
//             <td class="py-3 text-right text-gray-900" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827;">
//               ${schedule.RequesterName}
//             </td>
//           </tr>

//         </table>

//       </div>

//       <div class="mt-7 border-l-4 p-4 rounded text-xs leading-relaxed" style="margin-top: 28px; background-color: ${statusBoxBg}; border-left: 4px solid ${statusBgColor}; padding: 16px; border-radius: 0.25rem; font-size: 0.75rem; line-height: 1.625; color: #374151;">
//         ${
//           isApproved
//             ? `Your Zoom request is now approved and ready for scheduling coordination.`
//             : `Please coordinate with the IT team if you need clarification regarding the rejected request.`
//         }
//       </div>

//       <p class="mt-9 text-sm" style="margin-top: 36px; font-size: 0.875rem; line-height: 1.25rem;">
//         Regards,<br>
//         <strong class="font-bold text-gray-900" style="font-weight: 700; color: #111827;">IT Operations Team</strong>
//       </p>

//     </div>

//     <div class="bg-gray-50 text-center p-4 text-xs text-slate-400 border-t border-gray-200" style="background-color: #f9fafb; text-align: center; padding: 16px; font-size: 0.75rem; line-height: 1rem; color: #94a3b8; border-top: 1px solid #e5e7eb;">
//       Zoom Request Status Notification • Automated Message
//     </div>

//   </div>
// </div>
// `;

//     return this.emailService.sendEmail({
//       to: schedule.RequesterEmail,
//       subject,
//       body,
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EmailService } from './email.service';

interface StatusTheme {
  bgColor: string;
  boxBg: string;
  boxText: string;
  icon: string;
  title: string;
  message: string;
  notice: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApproveZoomEmailService {
  constructor(private emailService: EmailService) {}

  sendStatusEmail(schedule: any, newStatus: string): Observable<any> {
    // Early guard: Fixes TS(2355) by ensuring an Observable is returned on all paths
    if (!schedule?.RequesterEmail) {
      console.error('❌ Cannot send status email: RequesterEmail is missing.');
      return of(null);
    }

    const normalizedStatus = (newStatus || '').trim();
    const subject = `📅 Zoom Request ${normalizedStatus}: ${schedule.ActivityName || 'Meeting'}`;

    // Dynamic Theme Registry (Handles Approved, Rejected, Pending, & Fallback)
    const themes: Record<string, StatusTheme> = {
      Approved: {
        bgColor: '#16a34a',
        boxBg: '#ecfdf5',
        boxText: '#16a34a',
        icon: '✅',
        title: 'Zoom Request Approved',
        message: 'Your Zoom meeting request has been approved successfully.',
        notice: 'Your Zoom request is now approved and ready for scheduling coordination.',
      },
      Rejected: {
        bgColor: '#dc2626',
        boxBg: '#fef2f2',
        boxText: '#dc2626',
        icon: '❌',
        title: 'Zoom Request Rejected',
        message: 'Unfortunately, your Zoom meeting request was not approved.',
        notice: 'Please coordinate with the IT team if you need clarification regarding the rejected request.',
      },
   Pending: {
  bgColor: '#d97706',   // Amber / Warning status header
  boxBg: '#fffbeb',     // Soft yellow background
  boxText: '#d97706',   // Amber status text
  icon: '⏳',
  title: 'Zoom Request Pending',
  message: 'Your Zoom meeting request has been placed under review.',
  notice: 'Your request is currently pending review by the IT team. You will receive an update once a decision is made.',
},
    };

    const currentTheme = themes[normalizedStatus] || {
      bgColor: '#4f46e5',
      boxBg: '#eef2ff',
      boxText: '#4f46e5',
      icon: 'ℹ️',
      title: `Zoom Request ${normalizedStatus}`,
      message: `Your Zoom meeting request status has been updated to ${normalizedStatus}.`,
      notice: 'Please review your schedule details or contact the IT team for further information.',
    };

    const body = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    /* Mobile responsive overrides */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
      .content-padding {
        padding: 20px 16px !important;
      }
      .header-padding {
        padding: 24px 16px !important;
      }
      .table-cell-mobile {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        text-align: left !important;
        padding-bottom: 4px !important;
      }
      .table-cell-mobile-val {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        text-align: left !important;
        padding-bottom: 12px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Outer Background Container -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 20px 0;">
    <tr>
      <td align="center">

        <!-- Main Card Container (Max-Width 600px) -->
        <table role="presentation" class="email-container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; border-collapse: separate;">
          
          <!-- Header Section -->
          <tr>
            <td class="header-padding" style="background-color: ${currentTheme.bgColor}; text-align: center; padding: 32px 24px; color: #ffffff;">
              <div style="font-size: 48px; line-height: 1;">
                ${currentTheme.icon}
              </div>
              <h1 style="margin: 12px 0 0 0; font-size: 24px; line-height: 32px; font-weight: 700; color: #ffffff;">
                ${currentTheme.title}
              </h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; line-height: 20px; color: #ffffff;">
                Zoom Schedule Status Update
              </p>
            </td>
          </tr>

          <!-- Body Content Section -->
          <tr>
            <td class="content-padding" style="padding: 32px 28px; color: #374151;">

              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Hello <strong style="font-weight: 600; color: #111827;">${schedule.RequesterName || 'User'}</strong>,
              </p>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #4b5563;">
                ${currentTheme.message}
              </p>

              <!-- Status Badge Callout -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color: ${currentTheme.boxBg}; border: 2px dashed ${currentTheme.bgColor}; border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: #6b7280; text-transform: uppercase;">
                      Current Request Status
                    </div>
                    <div style="margin-top: 8px; font-size: 26px; line-height: 30px; font-weight: 800; color: ${currentTheme.boxText};">
                      ${normalizedStatus.toUpperCase()}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Meeting Information Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">
                <tr>
                  <td colspan="2" style="padding-bottom: 12px; font-size: 14px; font-weight: 600; color: #111827;">
                    📅 Meeting Information
                  </td>
                </tr>

                <tr>
                  <td class="table-cell-mobile" style="padding: 8px 0; font-size: 14px; color: #6b7280; border-top: 1px solid #f3f4f6; width: 35%;">
                    Topic
                  </td>
                  <td class="table-cell-mobile-val" style="padding: 8px 0; font-size: 14px; text-align: right; color: ${currentTheme.boxText}; font-weight: 600; word-break: break-word; width: 65%;">
                    ${schedule.ActivityName || 'N/A'}
                  </td>
                </tr>

                <tr>
                  <td class="table-cell-mobile" style="padding: 8px 0; font-size: 14px; color: #6b7280; border-top: 1px solid #f3f4f6;">
                    Setup Type
                  </td>
                  <td class="table-cell-mobile-val" style="padding: 8px 0; font-size: 14px; text-align: right; color: #111827;">
                    ${schedule.SetupType || 'N/A'}
                  </td>
                </tr>

                <tr>
                  <td class="table-cell-mobile" style="padding: 8px 0; font-size: 14px; color: #6b7280; border-top: 1px solid #f3f4f6;">
                    Date
                  </td>
                  <td class="table-cell-mobile-val" style="padding: 8px 0; font-size: 14px; text-align: right; color: #111827;">
                    ${schedule.StartDate || ''}
                    ${schedule.EndDate ? ' → ' + schedule.EndDate : ''}
                  </td>
                </tr>

                <tr>
                  <td class="table-cell-mobile" style="padding: 8px 0; font-size: 14px; color: #6b7280; border-top: 1px solid #f3f4f6;">
                    Time
                  </td>
                  <td class="table-cell-mobile-val" style="padding: 8px 0; font-size: 14px; text-align: right; color: #111827;">
                    ${schedule.TimeStart || ''} - ${schedule.TimeEnd || ''}
                  </td>
                </tr>

                <tr>
                  <td class="table-cell-mobile" style="padding: 8px 0; font-size: 14px; color: #6b7280; border-top: 1px solid #f3f4f6;">
                    Requester
                  </td>
                  <td class="table-cell-mobile-val" style="padding: 8px 0; font-size: 14px; text-align: right; color: #111827;">
                    ${schedule.RequesterName || 'N/A'}
                  </td>
                </tr>
              </table>

              <!-- Action / Note Notice -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td style="background-color: ${currentTheme.boxBg}; border-left: 4px solid ${currentTheme.bgColor}; padding: 14px 16px; border-radius: 4px; font-size: 12px; line-height: 20px; color: #374151;">
                    ${currentTheme.notice}
                  </td>
                </tr>
              </table>

              <p style="margin: 28px 0 0 0; font-size: 14px; line-height: 20px; color: #374151;">
                Regards,<br>
                <strong style="font-weight: 700; color: #111827;">IT Operations Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #f9fafb; text-align: center; padding: 16px; font-size: 12px; line-height: 16px; color: #94a3b8; border-top: 1px solid #e5e7eb;">
              Zoom Request Status Notification • Automated Message
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    return this.emailService.sendEmail({
      to: schedule.RequesterEmail,
      subject,
      body,
    });
  }
}