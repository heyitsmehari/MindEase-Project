import emailjs from '@emailjs/browser';

// ============================================================
// EMAILJS CONFIGURATION
// Sign up free at https://www.emailjs.com/
// 1. Create a Gmail service → copy Service ID
// 2. Create TWO templates (see template variables below)
// 3. Settings → API Keys → copy Public Key
// ============================================================

export const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';   // ← Replace
export const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // ← Replace

// ── Template A: sent to the PSYCHOLOGIST/ADMIN ──────────────
// Template ID for notifying the admin when a student books
export const EMAILJS_ADMIN_TEMPLATE_ID = 'YOUR_ADMIN_TEMPLATE_ID'; // ← Replace

// Template variables used in the admin email template:
//   {{admin_email}}       — psychologist / admin email (To field)
//   {{student_name}}      — student's full name
//   {{student_email}}     — student's email (for reply)
//   {{student_phone}}     — student's contact number
//   {{student_year}}      — year / roll number
//   {{appointment_type}}  — counseling / therapy / consultation / follow-up
//   {{preferred_date}}    — preferred date
//   {{preferred_time}}    — preferred time slot
//   {{concern}}           — student's message / reason
//   {{is_first_visit}}    — Yes / No

// ── Template B: sent to the STUDENT as acknowledgement ──────
// Template ID for confirming receipt to the student
export const EMAILJS_STUDENT_TEMPLATE_ID = 'YOUR_STUDENT_TEMPLATE_ID'; // ← Replace

// Template variables used in the student confirmation template:
//   {{student_name}}      — student's full name
//   {{student_email}}     — student's email (To field)
//   {{appointment_type}}  — selected appointment type
//   {{preferred_date}}    — preferred date
//   {{preferred_time}}    — preferred time slot
//   {{admin_email}}       — admin contact email (so student knows who to follow up with)

// ── Hardcoded admin email (you can update this any time) ─────────────
export const ADMIN_PSYCHOLOGIST_EMAIL = 'mindease.nitkkr@gmail.com'; // ← Update this

// ── Types ─────────────────────────────────────────────────────────────
export interface AppointmentData {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    studentYear: string;
    appointmentType: string;
    preferredDate: string;
    preferredTime: string;
    concern: string;
    isFirstVisit: string;
}

// ── Send email TO the admin/psychologist ────────────────────────────
export async function sendAppointmentToAdmin(data: AppointmentData): Promise<void> {
    await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ADMIN_TEMPLATE_ID,
        {
            admin_email: ADMIN_PSYCHOLOGIST_EMAIL,
            student_name: data.studentName,
            student_email: data.studentEmail,
            student_phone: data.studentPhone,
            student_year: data.studentYear,
            appointment_type: data.appointmentType,
            preferred_date: data.preferredDate,
            preferred_time: data.preferredTime,
            concern: data.concern || 'Not specified',
            is_first_visit: data.isFirstVisit,
        },
        EMAILJS_PUBLIC_KEY,
    );
}

// ── Send confirmation email TO the student ───────────────────────────
export async function sendConfirmationToStudent(data: AppointmentData): Promise<void> {
    await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_STUDENT_TEMPLATE_ID,
        {
            student_name: data.studentName,
            student_email: data.studentEmail,
            appointment_type: data.appointmentType,
            preferred_date: data.preferredDate,
            preferred_time: data.preferredTime,
            admin_email: ADMIN_PSYCHOLOGIST_EMAIL,
        },
        EMAILJS_PUBLIC_KEY,
    );
}

// ── Wrapper used by MentorDetail → sends appointment request to mentor ────────
export interface MentorAppointmentData {
    mentorName: string;
    mentorEmail: string;
    studentName: string;
    studentEmail: string;
    concern: string;
}

export async function sendAppointmentRequest(data: MentorAppointmentData): Promise<void> {
    await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ADMIN_TEMPLATE_ID,
        {
            admin_email: data.mentorEmail,
            student_name: data.studentName,
            student_email: data.studentEmail,
            student_phone: 'N/A',
            student_year: 'N/A',
            appointment_type: 'Mentor Session',
            preferred_date: 'To be decided by mentor',
            preferred_time: 'To be decided by mentor',
            concern: data.concern,
            is_first_visit: 'N/A',
        },
        EMAILJS_PUBLIC_KEY,
    );
}
