// import { Injectable } from '@angular/core';
// import { EmailService } from '../notification-services/email.service';
// import { UserService } from '../UserServices/user.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class SlaService {
//   private agentsCache: string[] = [];

//   constructor(
//     private mailService: EmailService,
//     private userService: UserService,
//   ) {
//     // Load agents once (prevents repeated API calls)
//     this.userService.getAgents().subscribe((agents: string[]) => {
//       this.agentsCache = agents;
//     });
//   }

//   checkSlaNotifications(tickets: any[], getRemainingTime: (t: any) => string) {
//     const now = Date.now();

//     tickets.forEach((ticket) => {
//       if (!ticket.DueDate || ticket.CurrentStatus === 'Resolved') return;

//       const due = new Date(ticket.DueDate).getTime();
//       const remaining = due - now;

//       // 🚨 OVERDUE EMAIL (only once)
//       if (remaining <= 0 && !ticket.overdueNotified) {
//         ticket.overdueNotified = true;
//         ticket.slaNotified = true; // stop SLA email after overdue

//         this.sendOverdueEmail(ticket);
//         return;
//       }

//       // ⚠️ SLA WARNING
//       let threshold = 0;

//       switch (ticket.PriorityLevel) {
//         case 'High':
//           threshold = 1 * 60 * 60 * 1000; // 1 hour
//           break;

//         case 'Medium':
//           threshold = 5 * 60 * 60 * 1000; // 5 hours
//           break;

//         case 'Low':
//           threshold = 10 * 60 * 60 * 1000; // 10 hours
//           break;
//       }

//       if (remaining <= threshold && !ticket.slaNotified) {
//         ticket.slaNotified = true;
//         this.sendSlaEmail(ticket, getRemainingTime(ticket));
//       }
//     });
//   }

//   private sendSlaEmail(ticket: any, remainingTime: string) {
//     const payload = {
//       // ======================================================
//       // CUSTOMER SLA WARNING EMAIL (Light Yellow/Amber Theme)
//       // ======================================================
//       to: ticket.Email,

//       subject: `⚠️ SLA Warning - Ticket ${ticket.TicketNumber}`,

//       body: `
// <div class="font-sans bg-amber-50 py-10 px-5" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fff8e8; padding-top: 40px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px;">

//   <div class="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden border border-amber-200" style="max-width: 620px; margin-left: auto; margin-right: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fde68a;">

//     <div class="bg-amber-500 text-white text-center p-7" style="background-color: #f59e0b; color: #ffffff; text-align: center; padding: 28px;">

//       <div class="text-5xl" style="font-size: 48px; line-height: 1;">
//         ⚠️
//       </div>

//       <h1 class="mt-2.5 text-2xl font-bold" style="margin-top: 10px; margin-bottom: 0; font-size: 24px; font-weight: 700;">
//         SLA Warning Notice
//       </h1>

//       <p class="mt-2 text-white/95 text-sm" style="margin-top: 8px; opacity: 0.95; font-size: 14px;">
//         Your ticket requires immediate attention
//       </p>

//     </div>

//     <div class="p-9 text-gray-700" style="padding: 35px; color: #374151;">

//       <p class="text-base" style="font-size: 16px;">
//         Hello <strong class="font-bold" style="font-weight: 700;">${ticket.FullName}</strong>,
//       </p>

//       <p class="text-sm leading-relaxed mt-2" style="line-height: 1.7; font-size: 14px; margin-top: 8px;">
//         Your support ticket is approaching its SLA deadline.
//         Please monitor updates regarding this request.
//       </p>

//       <div class="my-7 bg-amber-50 border-2 border-dashed border-amber-500 rounded-xl p-5.5 text-center" style="background-color: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; padding: 22px; text-align: center; margin-top: 28px; margin-bottom: 28px;">

//         <div class="text-xs text-amber-800 font-semibold tracking-wider" style="font-size: 13px; color: #92400e; font-weight: 600;">
//           TICKET NUMBER
//         </div>

//         <div class="mt-2 text-3xl font-bold text-amber-600" style="font-size: 28px; font-weight: 700; color: #d97706; margin-top: 8px;">
//           ${ticket.TicketNumber}
//         </div>

//       </div>

//       <div class="mt-2.5">
//         <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 14px;">

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Priority
//             </td>
//             <td class="py-3 text-right text-gray-900 font-medium" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827; font-weight: 500;">
//               ${ticket.PriorityLevel}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Remaining Time
//             </td>
//             <td class="py-3 text-right text-amber-600 font-bold" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #d97706; font-weight: 700;">
//               ${remainingTime}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Help Topic
//             </td>
//             <td class="py-3 text-right text-gray-900 font-medium" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827; font-weight: 500;">
//               ${ticket.HelpTopic}
//             </td>
//           </tr>

//         </table>
//       </div>

//       <div class="mt-7 bg-amber-100 border-l-4 border-amber-500 p-4 rounded-lg text-amber-950 text-xs leading-relaxed" style="margin-top: 28px; background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; line-height: 1.7; color: #451a03; font-size: 13px;">
//         Please coordinate with the assigned support personnel before the SLA expires.
//       </div>

//       <p class="mt-9 text-sm" style="margin-top: 35px; font-size: 14px;">
//         Regards,<br>
//         <strong class="font-bold text-gray-900" style="font-weight: 700; color: #111827;">IT Support Team</strong>
//       </p>

//     </div>

//     <div class="bg-amber-50 text-center p-3.5 text-xs text-amber-800" style="background-color: #fffbeb; text-align: center; padding: 15px; font-size: 12px; color: #92400e;">
//       SLA Notification • Customer Copy
//     </div>

//   </div>
// </div>
// `,

//       // ======================================================
//       // INTERNAL AGENT SLA EMAIL (Dark Theme - Amber Accents)
//       // ======================================================
//       agents: this.agentsCache,

//       agentSubject: `⚠️ SLA Alert - ${ticket.TicketNumber}`,

//       agentBody: `
// <div class="font-mono bg-slate-900 p-7.5" style="font-family: Consolas, Monaco, monospace, ui-sans-serif; background-color: #0f172a; padding: 30px;">

//   <div class="max-w-3xl mx-auto bg-gray-900 rounded-xl overflow-hidden border border-slate-700" style="max-width: 760px; margin-left: auto; margin-right: auto; background-color: #111827; border-radius: 14px; overflow: hidden; border: 1px solid #334155;">

//     <div class="bg-amber-500 text-white py-5.5 px-7.5" style="background-color: #f59e0b; color: #ffffff; padding-top: 22px; padding-bottom: 22px; padding-left: 30px; padding-right: 30px;">

//       <div class="text-xs font-semibold tracking-wider" style="font-size: 12px; letter-spacing: 1px; font-weight: 600;">
//         INTERNAL SLA WARNING
//       </div>

//       <h2 class="mt-2 text-xl font-bold" style="margin-top: 8px; margin-bottom: 0; font-size: 20px; font-weight: 700;">
//         ⚠️ TICKET NEARING SLA
//       </h2>

//     </div>

//     <div class="p-7.5 text-gray-100" style="padding: 30px; color: #f3f4f6;">

//       <div class="bg-slate-900 border border-gray-700 rounded-lg p-4.5 mb-6" style="background-color: #0f172a; border: 1px solid #374151; border-radius: 10px; padding: 18px; margin-bottom: 24px;">

//         <div class="text-gray-400 text-xs" style="font-size: 12px; color: #9ca3af;">
//           Ticket Reference
//         </div>

//         <div class="mt-1.5 text-2xl font-bold text-amber-400" style="font-size: 26px; color: #fbbf24; font-weight: 700; margin-top: 6px;">
//           ${ticket.TicketNumber}
//         </div>

//       </div>

//       <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 14px;">

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Client
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${ticket.FullName}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Priority
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${ticket.PriorityLevel}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Remaining Time
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-amber-400 font-bold" style="padding: 14px; border-bottom: 1px solid #374151; color: #fbbf24; font-weight: 700;">
//             ${remainingTime}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Topic
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${ticket.HelpTopic}
//           </td>
//         </tr>

//       </table>

//       <div class="mt-7 bg-slate-800 border-l-4 border-amber-500 p-4.5 rounded-lg text-gray-200 text-xs leading-relaxed" style="margin-top: 28px; background-color: #1e293b; border-left: 4px solid #f59e0b; padding: 18px; border-radius: 8px; line-height: 1.7; color: #e5e7eb; font-size: 13px;">
//         Immediate monitoring is required before SLA breach occurs.
//       </div>

//     </div>

//     <div class="bg-slate-900 p-3.5 text-center text-gray-500 text-xs" style="background-color: #0f172a; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
//       Internal SLA Monitoring Notification
//     </div>

//   </div>
// </div>
// `,
//     };

//     this.mailService.sendEmail(payload).subscribe();
//   }

//   private sendOverdueEmail(ticket: any) {
//     const payload = {
//       // ======================================================
//       // CUSTOMER OVERDUE EMAIL (Soft Red Theme)
//       // ======================================================
//       to: ticket.Email,

//       subject: `🚨 OVERDUE ALERT - Ticket ${ticket.TicketNumber}`,

//       body: `
// <div class="font-sans bg-rose-50 py-10 px-5" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fff1f2; padding-top: 40px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px;">

//   <div class="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden border border-rose-200" style="max-width: 640px; margin-left: auto; margin-right: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fecdd3;">

//     <div class="bg-red-600 text-white text-center p-7.5" style="background-color: #dc2626; color: #ffffff; text-align: center; padding: 30px;">

//       <div class="text-5xl" style="font-size: 52px; line-height: 1;">
//         🚨
//       </div>

//       <h1 class="mt-2.5 text-2xl font-bold" style="margin-top: 10px; margin-bottom: 0; font-size: 26px; font-weight: 700;">
//         Ticket Overdue
//       </h1>

//       <p class="mt-2 text-white text-sm" style="margin-top: 8px; font-size: 14px;">
//         Immediate action is required
//       </p>

//     </div>

//     <div class="p-9 text-gray-700" style="padding: 35px; color: #374151;">

//       <p class="text-base" style="font-size: 16px;">
//         Hello <strong class="font-bold" style="font-weight: 700;">${ticket.FullName}</strong>,
//       </p>

//       <p class="text-sm leading-relaxed mt-2" style="line-height: 1.8; font-size: 14px; margin-top: 8px;">
//         Your support ticket has exceeded its SLA deadline and is now marked as
//         <strong class="text-red-600 font-bold" style="color: #dc2626; font-weight: 700;">
//           OVERDUE
//         </strong>.
//       </p>

//       <div class="my-7 bg-red-50 border-2 border-dashed border-red-600 rounded-xl p-5.5 text-center" style="margin-top: 28px; margin-bottom: 28px; background-color: #fef2f2; border: 2px dashed #dc2626; border-radius: 12px; padding: 22px; text-align: center;">

//         <div class="text-xs text-red-800 font-semibold tracking-wider" style="font-size: 13px; color: #991b1b; font-weight: 600;">
//           OVERDUE TICKET
//         </div>

//         <div class="mt-2 text-3xl font-bold text-red-600" style="margin-top: 8px; font-size: 28px; font-weight: 700; color: #dc2626;">
//           ${ticket.TicketNumber}
//         </div>

//       </div>

//       <div class="mt-2.5">
//         <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 14px;">

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Priority
//             </td>
//             <td class="py-3 text-right text-red-600 font-bold" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #dc2626; font-weight: 700;">
//               ${ticket.PriorityLevel}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Help Topic
//             </td>
//             <td class="py-3 text-right text-gray-900 font-medium" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827; font-weight: 500;">
//               ${ticket.HelpTopic}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Due Date
//             </td>
//             <td class="py-3 text-right text-gray-900 font-medium" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827; font-weight: 500;">
//               ${new Date(ticket.DueDate).toLocaleString()}
//             </td>
//           </tr>

//         </table>
//       </div>

//       <div class="mt-7.5 bg-red-50 border-l-4 border-red-600 p-4.5 rounded-lg text-xs leading-relaxed" style="margin-top: 30px; background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 18px; border-radius: 8px; line-height: 1.7; font-size: 13px; color: #7f1d1d;">
//         Please coordinate with the assigned support team immediately to avoid further escalation.
//       </div>

//       <p class="mt-9 text-sm" style="margin-top: 35px; font-size: 14px;">
//         Regards,<br>
//         <strong class="font-bold text-gray-900" style="font-weight: 700; color: #111827;">IT Support Team</strong>
//       </p>

//     </div>

//     <div class="bg-red-50 p-3.5 text-center text-red-800 text-xs" style="background-color: #fef2f2; padding: 15px; text-align: center; color: #991b1b; font-size: 12px;">
//       Overdue Notification • Customer Copy
//     </div>

//   </div>
// </div>
// `,

//       // ======================================================
//       // INTERNAL OVERDUE EMAIL (Dark Theme - Bright Red Accents)
//       // ======================================================
//       agents: this.agentsCache,

//       agentSubject: `🚨 OVERDUE - ${ticket.TicketNumber}`,

//       agentBody: `
// <div class="font-mono bg-slate-900 p-7.5" style="font-family: Consolas, Monaco, monospace, ui-sans-serif; background-color: #111827; padding: 30px;">

//   <div class="max-w-3xl mx-auto bg-gray-800 rounded-xl overflow-hidden border border-gray-700" style="max-width: 760px; margin-left: auto; margin-right: auto; background-color: #1f2937; border-radius: 14px; overflow: hidden; border: 1px solid #374151;">

//     <div class="bg-red-700 text-white py-5.5 px-7.5" style="background-color: #b91c1c; color: #ffffff; padding-top: 22px; padding-bottom: 22px; padding-left: 30px; padding-right: 30px;">

//       <div class="text-xs font-semibold tracking-wider" style="font-size: 12px; letter-spacing: 1px; font-weight: 600;">
//         INTERNAL OVERDUE ESCALATION
//       </div>

//       <h2 class="mt-2 text-xl font-bold" style="margin: 8px 0 0; font-size: 20px; font-weight: 700;">
//         🚨 SLA BREACH DETECTED
//       </h2>

//     </div>

//     <div class="p-7.5 text-gray-100" style="padding: 30px; color: #f3f4f6;">

//       <div class="bg-slate-900 border border-gray-700 rounded-lg p-4.5 mb-6" style="background-color: #111827; border: 1px solid #374151; border-radius: 10px; padding: 18px; margin-bottom: 24px;">

//         <div class="text-gray-400 text-xs" style="font-size: 12px; color: #9ca3af;">
//           Ticket Reference
//         </div>

//         <div class="mt-1.5 text-2xl font-bold text-red-400" style="margin-top: 6px; font-size: 26px; font-weight: 700; color: #f87171;">
//           ${ticket.TicketNumber}
//         </div>

//       </div>

//       <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 14px;">

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Client
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${ticket.FullName}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Priority
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-red-400 font-bold" style="padding: 14px; border-bottom: 1px solid #374151; color: #f87171; font-weight: 700;">
//             ${ticket.PriorityLevel}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Due Date
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${new Date(ticket.DueDate).toLocaleString()}
//           </td>
//         </tr>

//       </table>

//       <div class="mt-7 bg-slate-900 border-l-4 border-red-600 p-4.5 rounded-lg text-gray-200 text-xs leading-relaxed" style="margin-top: 28px; background-color: #0f172a; border-left: 4px solid #dc2626; padding: 18px; border-radius: 8px; color: #e5e7eb; line-height: 1.7; font-size: 13px;">
//         Immediate escalation and resolution is required.
//       </div>

//     </div>

//     <div class="bg-slate-900 p-3.5 text-center text-xs text-gray-500" style="background-color: #111827; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
//       Internal Escalation Notification • IT Department
//     </div>

//   </div>
// </div>
// `,
//     };

//     this.mailService.sendEmail(payload).subscribe();
//   }

//   // 📩 STATUS EMAIL (Resolved / Reopened)
//   sendStatusEmail(ticket: any, status: string) {
//     if (!ticket.Email) return;

//     const statusColor = status === 'Resolved' ? '#16a34a' : '#2563eb';
//     const statusTailwindBg =
//       status === 'Resolved' ? 'bg-green-600' : 'bg-blue-600';
//     const statusTailwindBorder =
//       status === 'Resolved' ? 'border-green-600' : 'border-blue-600';
//     const statusTailwindText =
//       status === 'Resolved' ? 'text-green-600' : 'text-blue-600';

//     const statusIcon = status === 'Resolved' ? '✅' : '🔄';
//     const statusLabel =
//       status === 'Resolved' ? 'Ticket Resolved' : 'Ticket Reopened';

//     const payload = {
//       // ======================================================
//       // CUSTOMER STATUS EMAIL (Adaptive Slate Background)
//       // ======================================================
//       to: ticket.Email,

//       subject: `${statusIcon} ${statusLabel} - ${ticket.TicketNumber}`,

//       body: `
// <div class="font-sans bg-slate-100 py-10 px-5" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f9; padding-top: 40px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px;">

//   <div class="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200" style="max-width: 620px; margin-left: auto; margin-right: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">

//     <div class="${statusTailwindBg} text-white text-center p-7.5" style="background-color: ${statusColor}; color: #ffffff; text-align: center; padding: 30px;">

//       <div class="text-5xl" style="font-size: 50px; line-height: 1;">
//         ${statusIcon}
//       </div>

//       <h1 class="mt-2.5 text-2xl font-bold" style="margin-top: 10px; margin-bottom: 0; font-size: 24px; font-weight: 700;">
//         ${statusLabel}
//       </h1>

//     </div>

//     <div class="p-9 text-gray-700" style="padding: 35px; color: #374151;">

//       <p class="text-base" style="font-size: 16px;">
//         Hello <strong class="font-bold" style="font-weight: 700;">${ticket.FullName}</strong>,
//       </p>

//       <p class="text-sm leading-relaxed mt-2" style="line-height: 1.8; font-size: 14px; margin-top: 8px;">
//         Your support ticket status has been updated successfully.
//       </p>

//       <div class="my-7 bg-gray-50 border-2 border-dashed ${statusTailwindBorder} rounded-xl p-5.5 text-center" style="margin-top: 28px; margin-bottom: 28px; background-color: #f9fafb; border: 2px dashed ${statusColor}; border-radius: 12px; padding: 22px; text-align: center;">

//         <div class="text-xs text-gray-500 font-semibold tracking-wider" style="font-size: 13px; color: #6b7280; font-weight: 600;">
//           CURRENT STATUS
//         </div>

//         <div class="mt-2 text-3xl font-bold ${statusTailwindText}" style="margin-top: 8px; font-size: 28px; font-weight: 700; color: ${statusColor};">
//           ${status}
//         </div>

//       </div>

//       <div class="mt-2.5">
//         <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 14px;">

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Ticket Number
//             </td>
//             <td class="py-3 text-right text-gray-900 font-medium" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827; font-weight: 500;">
//               ${ticket.TicketNumber}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Priority
//             </td>
//             <td class="py-3 text-right text-gray-900 font-medium" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827; font-weight: 500;">
//               ${ticket.PriorityLevel}
//             </td>
//           </tr>

//           <tr>
//             <td class="py-3 text-gray-500" style="padding-top: 12px; padding-bottom: 12px; color: #6b7280;">
//               Help Topic
//             </td>
//             <td class="py-3 text-right text-gray-900 font-medium" style="padding-top: 12px; padding-bottom: 12px; text-align: right; color: #111827; font-weight: 500;">
//               ${ticket.HelpTopic}
//             </td>
//           </tr>

//         </table>
//       </div>

//       <p class="mt-9 text-sm" style="margin-top: 35px; font-size: 14px;">
//         Thank you,<br>
//         <strong class="font-bold text-gray-900" style="font-weight: 700; color: #111827;">IT Support Team</strong>
//       </p>

//     </div>

//     <div class="bg-gray-50 p-3.5 text-center text-gray-400 text-xs" style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
//       Ticket Status Notification • Customer Copy
//     </div>

//   </div>
// </div>
// `,

//       // ======================================================
//       // INTERNAL STATUS EMAIL (Dark Shell)
//       // ======================================================
//       agents: ticket.AgentAssigned ? [ticket.AgentAssigned] : this.agentsCache,

//       agentSubject: `${statusIcon} ${ticket.TicketNumber} ${status}`,

//       agentBody: `
// <div class="font-mono bg-slate-900 p-7.5" style="font-family: Consolas, Monaco, monospace, ui-sans-serif; background-color: #111827; padding: 30px;">

//   <div class="max-w-3xl mx-auto bg-gray-800 rounded-xl overflow-hidden border border-gray-700" style="max-width: 760px; margin-left: auto; margin-right: auto; background-color: #1f2937; border-radius: 14px; overflow: hidden; border: 1px solid #374151;">

//     <div class="${statusTailwindBg} text-white py-5.5 px-7.5" style="background-color: ${statusColor}; color: #ffffff; padding-top: 22px; padding-bottom: 22px; padding-left: 30px; padding-right: 30px;">

//       <div class="text-xs font-semibold tracking-wider" style="font-size: 12px; letter-spacing: 1px; font-weight: 600;">
//         INTERNAL STATUS UPDATE
//       </div>

//       <h2 class="mt-2 text-xl font-bold" style="margin-top: 8px; margin-bottom: 0; font-size: 20px; font-weight: 700;">
//         ${statusIcon} TICKET ${status.toUpperCase()}
//       </h2>

//     </div>

//     <div class="p-7.5 text-gray-100" style="padding: 30px; color: #f3f4f6;">

//       <div class="bg-slate-900 border border-gray-700 rounded-lg p-4.5 mb-6" style="background-color: #111827; border: 1px solid #374151; border-radius: 10px; padding: 18px; margin-bottom: 24px;">

//         <div class="text-gray-400 text-xs" style="font-size: 12px; color: #9ca3af;">
//           Ticket Reference
//         </div>

//         <div class="mt-1.5 text-2xl font-bold ${statusTailwindText}" style="margin-top: 6px; font-size: 26px; font-weight: 700; color: ${statusColor};">
//           ${ticket.TicketNumber}
//         </div>

//       </div>

//       <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 14px;">

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Client
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${ticket.FullName}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Status
//           </td>
//           <td class="p-3.5 border-b border-gray-700 ${statusTailwindText} font-bold" style="padding: 14px; border-bottom: 1px solid #374151; color: ${statusColor}; font-weight: 700;">
//             ${status}
//           </td>
//         </tr>

//         <tr>
//           <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af;">
//             Priority
//           </td>
//           <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
//             ${ticket.PriorityLevel}
//           </td>
//         </tr>

//       </table>

//     </div>

//     <div class="bg-slate-900 p-3.5 text-center text-xs text-gray-500" style="background-color: #111827; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
//       Internal Status Notification • IT Department
//     </div>

//   </div>
// </div>
// `,
//     };

//     this.mailService.sendEmail(payload).subscribe();
//   }
// }


import { Injectable } from '@angular/core';
import { EmailService } from '../notification-services/email.service';
import { UserService } from '../UserServices/user.service';

@Injectable({
  providedIn: 'root',
})
export class SlaService {
  private agentsCache: string[] = [];

  constructor(
    private mailService: EmailService,
    private userService: UserService,
  ) {
    // Load agents once (prevents repeated API calls)
    this.userService.getAgents().subscribe((agents: string[]) => {
      this.agentsCache = agents;
    });
  }

  checkSlaNotifications(tickets: any[], getRemainingTime: (t: any) => string) {
    const now = Date.now();

    tickets.forEach((ticket) => {
      if (!ticket.DueDate || ticket.CurrentStatus === 'Resolved') return;

      const due = new Date(ticket.DueDate).getTime();
      const remaining = due - now;

      // 🚨 OVERDUE EMAIL (only once)
      if (remaining <= 0 && !ticket.overdueNotified) {
        ticket.overdueNotified = true;
        ticket.slaNotified = true; // stop SLA email after overdue

        this.sendOverdueEmail(ticket);
        return;
      }

      // ⚠️ SLA WARNING
      let threshold = 0;

      switch (ticket.PriorityLevel) {
        case 'High':
          threshold = 1 * 60 * 60 * 1000; // 1 hour
          break;

        case 'Medium':
          threshold = 5 * 60 * 60 * 1000; // 5 hours
          break;

        case 'Low':
          threshold = 10 * 60 * 60 * 1000; // 10 hours
          break;
      }

      if (remaining <= threshold && !ticket.slaNotified) {
        ticket.slaNotified = true;
        this.sendSlaEmail(ticket, getRemainingTime(ticket));
      }
    });
  }

  private sendSlaEmail(ticket: any, remainingTime: string) {
    const payload = {
      // ======================================================
      // CUSTOMER SLA WARNING EMAIL (Light Yellow/Amber Theme)
      // ======================================================
      to: ticket.Email,
      subject: `⚠️ SLA Warning - Ticket ${ticket.TicketNumber}`,
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
<body style="margin: 0; padding: 0; background-color: #fff8e8; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff8e8; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fde68a; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #f59e0b; padding: 28px 20px; color: #ffffff;">
              <div style="font-size: 48px; line-height: 1;">⚠️</div>
              <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700;">SLA Warning Notice</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 14px;">Your ticket requires immediate attention</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding: 35px; color: #374151;">
              <p style="margin: 0; font-size: 16px;">Hello <strong style="font-weight: 700;">${ticket.FullName}</strong>,</p>
              <p style="margin: 8px 0 25px 0; line-height: 1.7; font-size: 14px;">
                Your support ticket is approaching its SLA deadline. Please monitor updates regarding this request.
              </p>

              <!-- Ticket Number Container -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; margin-bottom: 25px;">
                <tr>
                  <td align="center" style="padding: 22px;">
                    <div style="font-size: 13px; color: #92400e; font-weight: 600; text-transform: uppercase;">TICKET NUMBER</div>
                    <div style="font-size: 28px; font-weight: 700; color: #d97706; margin-top: 8px;">${ticket.TicketNumber}</div>
                  </td>
                </tr>
              </table>

              <!-- Details Grid -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; word-break: break-word;">
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Priority</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #111827; font-weight: 500;">${ticket.PriorityLevel}</td>
                </tr>
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Remaining Time</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #d97706; font-weight: 700;">${remainingTime}</td>
                </tr>
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Help Topic</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #111827; font-weight: 500;">${ticket.HelpTopic}</td>
                </tr>
              </table>

              <div style="margin-top: 28px; background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; line-height: 1.7; color: #451a03; font-size: 13px;">
                Please coordinate with the assigned support personnel before the SLA expires.
              </div>

              <p style="margin: 35px 0 0 0; font-size: 14px; line-height: 1.5;">
                Regards,<br>
                <strong style="font-weight: 700; color: #111827;">IT Support Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fffbeb; padding: 15px; font-size: 12px; color: #92400e;">
              SLA Notification • Customer Copy
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,

      // ======================================================
      // INTERNAL AGENT SLA EMAIL (Dark Theme)
      // ======================================================
      agents: this.agentsCache,
      agentSubject: `⚠️ SLA Alert - ${ticket.TicketNumber}`,
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
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: Consolas, Monaco, monospace, ui-sans-serif, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 760px; width: 100%; background-color: #111827; border-radius: 14px; overflow: hidden; border: 1px solid #334155; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="background-color: #f59e0b; color: #ffffff; padding: 22px 30px;">
              <div style="font-size: 12px; letter-spacing: 1px; font-weight: 600; text-transform: uppercase;">INTERNAL SLA WARNING</div>
              <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700;">⚠️ TICKET NEARING SLA</h2>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding: 30px; color: #f3f4f6;">
              <!-- Ref Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; border: 1px solid #374151; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px;">
                    <div style="font-size: 12px; color: #9ca3af;">Ticket Reference</div>
                    <div style="font-size: 26px; color: #fbbf24; font-weight: 700; margin-top: 6px;">${ticket.TicketNumber}</div>
                  </td>
                </tr>
              </table>

              <!-- Data Grid -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; word-break: break-word;">
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Client</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">${ticket.FullName}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Priority</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">${ticket.PriorityLevel}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Remaining Time</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #fbbf24; font-weight: 700;">${remainingTime}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Topic</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">${ticket.HelpTopic}</td>
                </tr>
              </table>

              <div style="margin-top: 28px; background-color: #1e293b; border-left: 4px solid #f59e0b; padding: 18px; border-radius: 8px; line-height: 1.7; color: #e5e7eb; font-size: 13px;">
                Immediate monitoring is required before SLA breach occurs.
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0f172a; padding: 15px; color: #6b7280; font-size: 12px;">
              Internal SLA Monitoring Notification
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

    this.mailService.sendEmail(payload).subscribe();
  }

  private sendOverdueEmail(ticket: any) {
    const payload = {
      // ======================================================
      // CUSTOMER OVERDUE EMAIL (Soft Red Theme)
      // ======================================================
      to: ticket.Email,
      subject: `🚨 OVERDUE ALERT - Ticket ${ticket.TicketNumber}`,
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
<body style="margin: 0; padding: 0; background-color: #fff1f2; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff1f2; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fecdd3; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #dc2626; padding: 30px 20px; color: #ffffff;">
              <div style="font-size: 52px; line-height: 1;">🚨</div>
              <h1 style="margin: 10px 0 0 0; font-size: 26px; font-weight: 700;">Ticket Overdue</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px;">Immediate action is required</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding: 35px; color: #374151;">
              <p style="margin: 0; font-size: 16px;">Hello <strong style="font-weight: 700;">${ticket.FullName}</strong>,</p>
              <p style="margin: 8px 0 28px 0; line-height: 1.8; font-size: 14px;">
                Your support ticket has exceeded its SLA deadline and is now marked as
                <strong style="color: #dc2626; font-weight: 700;">OVERDUE</strong>.
              </p>

              <!-- Ticket Container -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef2f2; border: 2px dashed #dc2626; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td align="center" style="padding: 22px;">
                    <div style="font-size: 13px; color: #991b1b; font-weight: 600; text-transform: uppercase;">OVERDUE TICKET</div>
                    <div style="font-size: 28px; font-weight: 700; color: #dc2626; margin-top: 8px;">${ticket.TicketNumber}</div>
                  </td>
                </tr>
              </table>

              <!-- Table Data -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; word-break: break-word;">
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Priority</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #dc2626; font-weight: 700;">${ticket.PriorityLevel}</td>
                </tr>
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Help Topic</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #111827; font-weight: 500;">${ticket.HelpTopic}</td>
                </tr>
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Due Date</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #111827; font-weight: 500;">${new Date(ticket.DueDate).toLocaleString()}</td>
                </tr>
              </table>

              <div style="margin-top: 30px; background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 18px; border-radius: 8px; line-height: 1.7; font-size: 13px; color: #7f1d1d;">
                Please coordinate with the assigned support team immediately to avoid further escalation.
              </div>

              <p style="margin: 35px 0 0 0; font-size: 14px; line-height: 1.5;">
                Regards,<br>
                <strong style="font-weight: 700; color: #111827;">IT Support Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #fef2f2; padding: 15px; font-size: 12px; color: #991b1b;">
              Overdue Notification • Customer Copy
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,

      // ======================================================
      // INTERNAL OVERDUE EMAIL (Dark Theme - Bright Red Accents)
      // ======================================================
      agents: this.agentsCache,
      agentSubject: `🚨 OVERDUE - ${ticket.TicketNumber}`,
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
            <td style="background-color: #b91c1c; color: #ffffff; padding: 22px 30px;">
              <div style="font-size: 12px; letter-spacing: 1px; font-weight: 600; text-transform: uppercase;">INTERNAL OVERDUE ESCALATION</div>
              <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700;">🚨 SLA BREACH DETECTED</h2>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding: 30px; color: #f3f4f6;">
              <!-- Ref Container -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid #374151; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px;">
                    <div style="font-size: 12px; color: #9ca3af;">Ticket Reference</div>
                    <div style="font-size: 26px; font-weight: 700; color: #f87171; margin-top: 6px;">${ticket.TicketNumber}</div>
                  </td>
                </tr>
              </table>

              <!-- Details Grid -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; word-break: break-word;">
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Client</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">${ticket.FullName}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Priority</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #f87171; font-weight: 700;">${ticket.PriorityLevel}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Due Date</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">${new Date(ticket.DueDate).toLocaleString()}</td>
                </tr>
              </table>

              <div style="margin-top: 28px; background-color: #0f172a; border-left: 4px solid #dc2626; padding: 18px; border-radius: 8px; color: #e5e7eb; line-height: 1.7; font-size: 13px;">
                Immediate escalation and resolution is required.
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #111827; padding: 15px; font-size: 12px; color: #6b7280;">
              Internal Escalation Notification • IT Department
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

    this.mailService.sendEmail(payload).subscribe();
  }

  // 📩 STATUS EMAIL (Resolved / Reopened)
  sendStatusEmail(ticket: any, status: string) {
    if (!ticket.Email) return;

    const statusColor = status === 'Resolved' ? '#16a34a' : '#2563eb';
    const statusIcon = status === 'Resolved' ? '✅' : '🔄';
    const statusLabel = status === 'Resolved' ? 'Ticket Resolved' : 'Ticket Reopened';

    const payload = {
      // ======================================================
      // CUSTOMER STATUS EMAIL
      // ======================================================
      to: ticket.Email,
      subject: `${statusIcon} ${statusLabel} - ${ticket.TicketNumber}`,
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
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: ${statusColor}; color: #ffffff; padding: 30px 20px;">
              <div style="font-size: 50px; line-height: 1;">${statusIcon}</div>
              <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700;">${statusLabel}</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td class="content-padding" style="padding: 35px; color: #374151;">
              <p style="margin: 0; font-size: 16px;">Hello <strong style="font-weight: 700;">${ticket.FullName}</strong>,</p>
              <p style="margin: 8px 0 28px 0; line-height: 1.8; font-size: 14px;">
                Your support ticket status has been updated successfully.
              </p>

              <!-- Status Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border: 2px dashed ${statusColor}; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td align="center" style="padding: 22px;">
                    <div style="font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase;">CURRENT STATUS</div>
                    <div style="font-size: 28px; font-weight: 700; color: ${statusColor}; margin-top: 8px;">${status}</div>
                  </td>
                </tr>
              </table>

              <!-- Details Grid -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; word-break: break-word;">
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Ticket Number</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #111827; font-weight: 500;">${ticket.TicketNumber}</td>
                </tr>
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Priority</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #111827; font-weight: 500;">${ticket.PriorityLevel}</td>
                </tr>
                <tr>
                  <td class="stack-column" style="padding: 12px 0; color: #6b7280; width: 40%;">Help Topic</td>
                  <td class="stack-column-right" style="padding: 12px 0; text-align: right; color: #111827; font-weight: 500;">${ticket.HelpTopic}</td>
                </tr>
              </table>

              <p style="margin: 35px 0 0 0; font-size: 14px; line-height: 1.5;">
                Thank you,<br>
                <strong style="font-weight: 700; color: #111827;">IT Support Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f9fafb; padding: 15px; font-size: 12px; color: #9ca3af;">
              Ticket Status Notification • Customer Copy
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,

      // ======================================================
      // INTERNAL STATUS EMAIL (Dark Theme)
      // ======================================================
      agents: ticket.AgentAssigned ? [ticket.AgentAssigned] : this.agentsCache,
      agentSubject: `${statusIcon} ${ticket.TicketNumber} ${status}`,
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
            <td style="background-color: ${statusColor}; color: #ffffff; padding: 22px 30px;">
              <div style="font-size: 12px; letter-spacing: 1px; font-weight: 600; text-transform: uppercase;">INTERNAL STATUS UPDATE</div>
              <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700;">${statusIcon} TICKET ${status.toUpperCase()}</h2>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content-padding" style="padding: 30px; color: #f3f4f6;">
              <!-- Ref Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border: 1px solid #374151; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px;">
                    <div style="font-size: 12px; color: #9ca3af;">Ticket Reference</div>
                    <div style="font-size: 26px; font-weight: 700; color: ${statusColor}; margin-top: 6px;">${ticket.TicketNumber}</div>
                  </td>
                </tr>
              </table>

              <!-- Details Grid -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; word-break: break-word;">
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Client</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">${ticket.FullName}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Status</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: ${statusColor}; font-weight: 700;">${status}</td>
                </tr>
                <tr>
                  <td class="stack-cell stack-label" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500; width: 30%;">Priority</td>
                  <td class="stack-cell stack-value" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">${ticket.PriorityLevel}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #111827; padding: 15px; font-size: 12px; color: #6b7280;">
              Internal Status Notification • IT Department
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

    this.mailService.sendEmail(payload).subscribe();
  }
}