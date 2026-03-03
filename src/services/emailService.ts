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

export interface MentorAppointmentData {
    mentorName: string;
    mentorEmail: string;
    studentName: string;
    studentEmail: string;
    concern: string;
}

// ── Placeholder functions (email sending not configured) ─────────────
export async function sendAppointmentToAdmin(_data: AppointmentData): Promise<void> {
    // TODO: Integrate your preferred email service (e.g. Formspree, Resend, Nodemailer)
    console.log('sendAppointmentToAdmin called', _data);
}

export async function sendConfirmationToStudent(_data: AppointmentData): Promise<void> {
    // TODO: Integrate your preferred email service
    console.log('sendConfirmationToStudent called', _data);
}

export async function sendAppointmentRequest(_data: MentorAppointmentData): Promise<void> {
    // TODO: Integrate your preferred email service
    console.log('sendAppointmentRequest called', _data);
}
