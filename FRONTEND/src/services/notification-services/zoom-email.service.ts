import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { EmailService } from './email.service';
import { UserService } from '../UserServices/user.service';

@Injectable({
  providedIn: 'root',
})
export class ZoomEmailService {
  constructor(
    private emailService: EmailService,
    private userService: UserService,
  ) {}

  sendZoomRequestEmail(form: any): Observable<any> {
    return this.userService.getZoomRecipients().pipe(
      switchMap((agents: string[]) => {
        const payload = {
          // =====================================================
          // REQUESTER EMAIL (Light Theme - Tailwind Blue)
          // =====================================================
          to: form.requesterEmail,

          subject: `📅 Zoom Request Received - ${form.activityName}`,

          body: `
<div class="font-sans bg-blue-50 py-10 px-5" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #eef6ff; padding-top: 40px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px;">

  <div class="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden border border-blue-100" style="max-width: 40.625rem; margin-left: auto; margin-right: auto; background-color: #ffffff; border-radius: 1rem; overflow: hidden; border: 1px solid #dbeafe;">

    <div class="bg-blue-600 text-center p-8 text-white" style="background-color: #2563eb; text-align: center; padding: 32px; color: #ffffff;">

      <div class="text-5xl" style="font-size: 3.25rem; line-height: 1;">
        📅
      </div>

      <h1 class="mt-2.5 text-2xl font-bold" style="margin-top: 10px; margin-bottom: 0; font-size: 1.625rem; line-height: 2.25rem; font-weight: 700;">
        Zoom Request Submitted
      </h1>

      <p class="mt-2 text-white/95 text-sm" style="margin-top: 8px; opacity: 0.95; font-size: 0.875rem; line-height: 1.25rem;">
        Meeting schedule request confirmation
      </p>

    </div>

    <div class="p-9 text-gray-700" style="padding: 35px; color: #374151;">

      <p class="text-base" style="font-size: 1rem; line-height: 1.5rem;">
        Hello <strong class="font-bold" style="font-weight: 700;">${form.requesterName}</strong>,
      </p>

      <p class="text-sm leading-relaxed" style="font-size: 0.875rem; line-height: 1.8;">
        Your Zoom meeting request has been successfully submitted.
        Our IT team will review and process your request shortly.
      </p>

      <div class="my-7 bg-blue-50/30 border-2 border-dashed border-blue-600 rounded-xl p-5.5" style="margin-top: 28px; margin-bottom: 28px; background-color: #f8fbff; border: 2px dashed #2563eb; border-radius: 0.875rem; padding: 22px;">

        <div class="text-center mb-4.5" style="text-align: center; margin-bottom: 18px;">

          <div class="text-xs text-gray-500 font-semibold tracking-wider" style="font-size: 0.8125rem; color: #6b7280; font-weight: 600; letter-spacing: 0.05em;">
            MEETING TOPIC
          </div>

          <div class="text-2xl font-bold text-blue-600 mt-2" style="font-size: 1.5rem; line-height: 2rem; font-weight: 700; color: #2563eb; margin-top: 8px;">
            ${form.activityName}
          </div>

        </div>

        <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 0.875rem; line-height: 1.25rem;">

          <tr>
            <td class="py-2.5 text-gray-500" style="padding-top: 10px; padding-bottom: 10px; color: #6b7280;">
              Setup Type
            </td>
            <td class="py-2.5 text-right text-gray-900" style="padding-top: 10px; padding-bottom: 10px; text-align: right; color: #111827;">
              ${form.setupType}
            </td>
          </tr>

          <tr>
            <td class="py-2.5 text-gray-500" style="padding-top: 10px; padding-bottom: 10px; color: #6b7280;">
              Schedule
            </td>
            <td class="py-2.5 text-right text-gray-900" style="padding-top: 10px; padding-bottom: 10px; text-align: right; color: #111827;">
              ${form.startDate} → ${form.endDate}
            </td>
          </tr>

          <tr>
            <td class="py-2.5 text-gray-500" style="padding-top: 10px; padding-bottom: 10px; color: #6b7280;">
              Time
            </td>
            <td class="py-2.5 text-right text-gray-900" style="padding-top: 10px; padding-bottom: 10px; text-align: right; color: #111827;">
              ${form.timeStart} → ${form.timeEnd}
            </td>
          </tr>

          <tr>
            <td class="py-2.5 text-gray-500" style="padding-top: 10px; padding-bottom: 10px; color: #6b7280;">
              Office
            </td>
            <td class="py-2.5 text-right text-gray-900" style="padding-top: 10px; padding-bottom: 10px; text-align: right; color: #111827;">
              ${form.officeUnitProject}
            </td>
          </tr>

        </table>

      </div>

      <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg text-xs leading-relaxed text-blue-900" style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 0.5rem; font-size: 0.8125rem; line-height: 1.7; color: #1e3a8a;">
        You will receive another email once your Zoom request has been approved or updated.
      </div>

      <p class="mt-9 text-sm" style="margin-top: 35px; font-size: 0.875rem; line-height: 1.25rem;">
        Regards,<br>
        <strong class="font-bold text-gray-900" style="font-weight: 700; color: #111827;">IT Support Team</strong>
      </p>

    </div>

    <div class="bg-slate-50 text-center p-4 text-xs text-slate-400 border-t border-gray-100" style="background-color: #f8fafc; text-align: center; padding: 15px; font-size: 0.75rem; line-height: 1rem; color: #94a3b8; border-top: 1px solid #f1f5f9;">
      Zoom Request Confirmation • Requester Copy
    </div>

  </div>
</div>
`,

          // =====================================================
          // INTERNAL AGENT EMAIL (Dark Dev Theme - Slate/Emerald)
          // =====================================================
          agents: agents.filter((email) => email !== form.requesterEmail),

          agentSubject: `🆕 New Zoom Request - ${form.activityName}`,

          agentBody: `
<div class="font-mono bg-slate-900 p-7.5" style="font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace, ui-sans-serif, system-ui; background-color: #0f172a; padding: 30px;">

  <div class="max-w-3xl mx-auto bg-gray-900 rounded-2xl overflow-hidden border border-slate-700" style="max-width: 47.5rem; margin-left: auto; margin-right: auto; background-color: #111827; border-radius: 1rem; overflow: hidden; border: 1px solid #334155;">

    <div class="bg-emerald-600 text-white py-6 px-7.5" style="background-color: #059669; color: #ffffff; padding-top: 24px; padding-bottom: 24px; padding-left: 30px; padding-right: 30px;">

      <div class="text-xs font-semibold tracking-wider opacity-90" style="font-size: 0.75rem; line-height: 1rem; font-weight: 600; letter-spacing: 0.05em; opacity: 0.9;">
        INTERNAL ZOOM REQUEST
      </div>

      <h2 class="mt-2 text-xl font-bold" style="margin-top: 8px; margin-bottom: 0; font-size: 1.25rem; line-height: 1.75rem; font-weight: 700;">
        📥 NEW ZOOM SCHEDULE REQUEST
      </h2>

    </div>

    <div class="p-7.5 text-gray-100" style="padding: 30px; color: #f3f4f6;">

      <div class="bg-slate-900 border border-gray-700 rounded-xl p-5 mb-7" style="background-color: #0f172a; border: 1px solid #374151; border-radius: 0.75rem; padding: 20px; margin-bottom: 28px;">

        <div class="text-gray-400 text-xs font-semibold tracking-wider" style="color: #9ca3af; font-size: 0.75rem; line-height: 1rem; font-weight: 600; letter-spacing: 0.05em;">
          REQUESTED MEETING
        </div>

        <div class="mt-2 text-2xl font-bold text-emerald-400" style="margin-top: 8px; font-size: 1.5rem; line-height: 2rem; font-weight: 700; color: #34d399;">
          ${form.activityName}
        </div>

      </div>

      <table class="w-full border-collapse text-sm" style="width: 100%; border-collapse: collapse; font-size: 0.875rem; line-height: 1.25rem;">

        <tr>
          <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500;">
            Requester
          </td>
          <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
            ${form.requesterName}
          </td>
        </tr>

        <tr>
          <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500;">
            Email
          </td>
          <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
            ${form.requesterEmail}
          </td>
        </tr>

        <tr>
          <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500;">
            Setup Type
          </td>
          <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
            ${form.setupType}
          </td>
        </tr>

        <tr>
          <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500;">
            Schedule
          </td>
          <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
            ${form.startDate} → ${form.endDate}
          </td>
        </tr>

        <tr>
          <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500;">
            Time
          </td>
          <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
            ${form.timeStart} → ${form.timeEnd}
          </td>
        </tr>

        <tr>
          <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500;">
            Office
          </td>
          <td class="p-3.5 border-b border-gray-700 text-gray-100" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6;">
            ${form.officeUnitProject}
          </td>
        </tr>

        <tr>
          <td class="p-3.5 border-b border-gray-700 text-gray-400 font-medium" style="padding: 14px; border-bottom: 1px solid #374151; color: #9ca3af; font-weight: 500;">
            Description
          </td>
          <td class="p-3.5 border-b border-gray-700 text-gray-100 leading-relaxed" style="padding: 14px; border-bottom: 1px solid #374151; color: #f3f4f6; line-height: 1.7;">
            ${form.zoomDescription || '-'}
          </td>
        </tr>

        <tr>
          <td class="p-3.5 text-gray-400 font-medium" style="padding: 14px; color: #9ca3af; font-weight: 500;">
            Additional Info
          </td>
          <td class="p-3.5 text-gray-100 leading-relaxed" style="padding: 14px; color: #f3f4f6; line-height: 1.7;">
            ${form.additionalDetails || '-'}
          </td>
        </tr>

      </table>

      <div class="mt-7.5 bg-emerald-950/40 border-l-4 border-emerald-500 p-4.5 rounded-lg leading-relaxed text-emerald-200 text-xs" style="margin-top: 30px; background-color: #022c22; border-left: 4px solid #10b981; padding: 18px; border-radius: 0.5rem; line-height: 1.7; color: #d1fae5; font-size: 0.8125rem;">
        Please review, approve, and schedule the Zoom session in the admin system.
      </div>

    </div>

    <div class="bg-slate-900 p-4 text-center text-xs text-gray-500 border-t border-slate-800" style="background-color: #0f172a; padding: 15px; text-align: center; font-size: 0.75rem; line-height: 1rem; color: #6b7280; border-top: 1px solid #1e293b;">
      Internal Zoom Notification • IT Department
    </div>

  </div>
</div>
`,
        };

        return this.emailService.sendEmail(payload);
      }),
    );
  }
}
