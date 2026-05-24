package com.hospital.smartcare.util;

/**
 * Premium HTML email templates for SmartCare HMS.
 * All templates use inline CSS for maximum email client compatibility.
 */
public class EmailTemplates {

    private EmailTemplates() {
        // Utility class — prevent instantiation
    }

    // ─── Shared wrapper ────────────────────────────────────────────────

    private static String wrapInLayout(String innerContent) {
        return "<!DOCTYPE html>" +
            "<html lang=\"en\">" +
            "<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
            "<title>SmartCare HMS</title></head>" +
            "<body style=\"margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;\">" +
            "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#f0f4f8;padding:40px 0;\">" +
            "<tr><td align=\"center\">" +
            // Main card
            "<table role=\"presentation\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">" +
            // Header gradient bar
            "<tr><td style=\"background:linear-gradient(135deg,#0d6efd 0%,#0099ff 50%,#00c6ff 100%);padding:32px 40px;text-align:center;\">" +
            "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tr>" +
            "<td style=\"text-align:center;\">" +
            "<div style=\"display:inline-block;background:rgba(255,255,255,0.2);border-radius:12px;padding:10px 14px;margin-bottom:12px;\">" +
            "<span style=\"font-size:28px;color:#ffffff;\">&#9764;</span>" +  // ☤ medical symbol
            "</div>" +
            "<h1 style=\"margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;\">SmartCare HMS</h1>" +
            "<p style=\"margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:0.5px;text-transform:uppercase;\">Hospital Management System</p>" +
            "</td></tr></table>" +
            "</td></tr>" +
            // Body content
            "<tr><td style=\"padding:36px 40px;\">" +
            innerContent +
            "</td></tr>" +
            // Footer
            "<tr><td style=\"background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;\">" +
            "<p style=\"margin:0 0 4px;color:#94a3b8;font-size:12px;\">This is an automated message from SmartCare HMS.</p>" +
            "<p style=\"margin:0;color:#94a3b8;font-size:12px;\">Please do not reply to this email.</p>" +
            "<div style=\"margin-top:16px;\">" +
            "<span style=\"display:inline-block;width:6px;height:6px;background-color:#0d6efd;border-radius:50%;margin:0 3px;\"></span>" +
            "<span style=\"display:inline-block;width:6px;height:6px;background-color:#0099ff;border-radius:50%;margin:0 3px;\"></span>" +
            "<span style=\"display:inline-block;width:6px;height:6px;background-color:#00c6ff;border-radius:50%;margin:0 3px;\"></span>" +
            "</div>" +
            "</td></tr>" +
            "</table>" +
            "</td></tr></table>" +
            "</body></html>";
    }

    // ─── OTP code block (shared by registration & password reset) ─────

    private static String otpBlock(String otpCode) {
        return "<div style=\"text-align:center;margin:28px 0;\">" +
            "<div style=\"display:inline-block;background:linear-gradient(135deg,#eff6ff 0%,#e0f2fe 100%);border:2px dashed #0d6efd;border-radius:12px;padding:20px 48px;\">" +
            "<span style=\"font-size:36px;font-weight:800;letter-spacing:10px;color:#0d6efd;font-family:'Courier New',monospace;\">" + otpCode + "</span>" +
            "</div>" +
            "</div>";
    }

    private static String timerNote() {
        return "<div style=\"text-align:center;margin-bottom:24px;\">" +
            "<span style=\"display:inline-block;background-color:#fef3c7;color:#92400e;font-size:13px;padding:8px 16px;border-radius:20px;font-weight:600;\">" +
            "&#9200; Expires in 10 minutes" +
            "</span></div>";
    }

    private static String securityNote() {
        return "<div style=\"background-color:#f8fafc;border-left:4px solid #0d6efd;border-radius:0 8px 8px 0;padding:14px 18px;margin-top:24px;\">" +
            "<p style=\"margin:0;color:#64748b;font-size:13px;line-height:1.5;\">" +
            "<strong style=\"color:#334155;\">&#128274; Security Tip:</strong> Never share your OTP with anyone. SmartCare staff will never ask for your OTP." +
            "</p></div>";
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PUBLIC TEMPLATE METHODS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * Registration OTP email.
     */
    public static String registrationOtp(String otpCode, String patientName) {
        String inner =
            "<h2 style=\"margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;\">Welcome to SmartCare! &#128075;</h2>" +
            "<p style=\"margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;\">Hi <strong style=\"color:#334155;\">" + patientName + "</strong>, thank you for choosing SmartCare HMS. Use the verification code below to complete your registration.</p>" +
            "<p style=\"margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;text-align:center;font-weight:600;\">Your Verification Code</p>" +
            otpBlock(otpCode) +
            timerNote() +
            securityNote();
        return wrapInLayout(inner);
    }

    /**
     * Password reset OTP email.
     */
    public static String passwordResetOtp(String otpCode) {
        String inner =
            "<h2 style=\"margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;\">Password Reset Request &#128272;</h2>" +
            "<p style=\"margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;\">We received a request to reset your password. Use the code below to set a new password for your account.</p>" +
            "<p style=\"margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;text-align:center;font-weight:600;\">Password Reset Code</p>" +
            otpBlock(otpCode) +
            timerNote() +
            "<div style=\"background-color:#fef2f2;border-left:4px solid #ef4444;border-radius:0 8px 8px 0;padding:14px 18px;margin-top:24px;\">" +
            "<p style=\"margin:0;color:#64748b;font-size:13px;line-height:1.5;\">" +
            "<strong style=\"color:#991b1b;\">&#9888; Didn't request this?</strong> If you didn't request a password reset, please ignore this email. Your account remains secure." +
            "</p></div>";
        return wrapInLayout(inner);
    }

    /**
     * Appointment booked — sent to the patient.
     */
    public static String appointmentBookedPatient(String doctorName, String date, String slot) {
        String inner =
            "<h2 style=\"margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;\">Appointment Confirmed &#9989;</h2>" +
            "<p style=\"margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.6;\">Great news! Your appointment has been successfully booked. Here are the details:</p>" +
            // Details card
            "<div style=\"background:linear-gradient(135deg,#eff6ff 0%,#e0f2fe 100%);border-radius:12px;padding:24px 28px;margin-bottom:24px;\">" +
            "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" +
            detailRow("&#128105;&#8205;&#9877;&#65039; Doctor", "Dr. " + doctorName) +
            detailRow("&#128197; Date", date) +
            detailRow("&#128336; Time Slot", slot) +
            detailRow("&#128994; Status", "<span style=\"background-color:#dcfce7;color:#166534;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;\">CONFIRMED</span>") +
            "</table></div>" +
            // Tips
            "<div style=\"background-color:#f8fafc;border-left:4px solid #0d6efd;border-radius:0 8px 8px 0;padding:14px 18px;\">" +
            "<p style=\"margin:0;color:#64748b;font-size:13px;line-height:1.5;\">" +
            "<strong style=\"color:#334155;\">&#128161; Reminder:</strong> Please arrive 10 minutes before your scheduled time. Bring any relevant medical records." +
            "</p></div>";
        return wrapInLayout(inner);
    }

    /**
     * New appointment notification — sent to the doctor.
     */
    public static String appointmentBookedDoctor(String patientName, String date, String slot) {
        String inner =
            "<h2 style=\"margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;\">New Appointment Scheduled &#128203;</h2>" +
            "<p style=\"margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.6;\">A new appointment has been booked. Here are the details:</p>" +
            "<div style=\"background:linear-gradient(135deg,#eff6ff 0%,#e0f2fe 100%);border-radius:12px;padding:24px 28px;margin-bottom:24px;\">" +
            "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" +
            detailRow("&#129489;&#8205;&#9877; Patient", patientName) +
            detailRow("&#128197; Date", date) +
            detailRow("&#128336; Time Slot", slot) +
            detailRow("&#128308; Status", "<span style=\"background-color:#fef9c3;color:#854d0e;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;\">PENDING REVIEW</span>") +
            "</table></div>" +
            "<p style=\"margin:0;color:#64748b;font-size:14px;line-height:1.6;\">Please log in to your <strong>SmartCare dashboard</strong> to review and manage this appointment.</p>";
        return wrapInLayout(inner);
    }

    /**
     * Prescription ready — sent to the patient.
     */
    public static String prescriptionReady(String doctorName, String date) {
        String inner =
            "<h2 style=\"margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;\">Prescription Ready &#128138;</h2>" +
            "<p style=\"margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.6;\">Your prescription has been updated by your doctor. Here are the details:</p>" +
            "<div style=\"background:linear-gradient(135deg,#eff6ff 0%,#e0f2fe 100%);border-radius:12px;padding:24px 28px;margin-bottom:24px;\">" +
            "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" +
            detailRow("&#128105;&#8205;&#9877;&#65039; Doctor", "Dr. " + doctorName) +
            detailRow("&#128197; Appointment Date", date) +
            detailRow("&#128196; Prescription", "<span style=\"background-color:#dcfce7;color:#166534;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;\">AVAILABLE</span>") +
            "</table></div>" +
            "<p style=\"margin:0 0 16px;color:#64748b;font-size:14px;line-height:1.6;\">Log in to your SmartCare account to view the full prescription and diagnosis details.</p>" +
            "<div style=\"text-align:center;\">" +
            "<a href=\"#\" style=\"display:inline-block;background:linear-gradient(135deg,#0d6efd,#0099ff);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:600;font-size:14px;letter-spacing:0.3px;\">View Prescription</a>" +
            "</div>";
        return wrapInLayout(inner);
    }

    // ─── Helper for detail rows ────────────────────────────────────────

    private static String detailRow(String label, String value) {
        return "<tr>" +
            "<td style=\"padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06);color:#94a3b8;font-size:13px;font-weight:600;width:40%;vertical-align:middle;\">" + label + "</td>" +
            "<td style=\"padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06);color:#1e293b;font-size:14px;font-weight:600;vertical-align:middle;\">" + value + "</td>" +
            "</tr>";
    }
}
