package com.hospital.smartcare.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailNotificationService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:onboarding@resend.dev}")
    private String senderEmail;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendEmail(String toEmail, String subject, String bodyContent) {
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            sendViaResendApi(toEmail, subject, bodyContent);
        } else {
            sendViaSmtp(toEmail, subject, bodyContent);
        }
    }

    private void sendViaResendApi(String toEmail, String subject, String bodyContent) {
        try {
            String fromAddress = (senderEmail != null && senderEmail.contains("@")) ? senderEmail : "onboarding@resend.dev";
            String fromField = "SmartCare <" + fromAddress + ">";

            String jsonBody = String.format(
                "{\"from\":\"%s\",\"to\":[\"%s\"],\"subject\":%s,\"html\":%s}",
                escapeJson(fromField),
                escapeJson(toEmail.trim()),
                toJsonString(subject),
                toJsonString(bodyContent)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("✅ Real-time email delivered via Resend API to " + toEmail + " | ID: " + response.body());
            } else {
                System.err.println("❌ Resend API Error (" + response.statusCode() + "): " + response.body());
            }
        } catch (Exception ex) {
            System.err.println("⚠️ Failed to send real-time email via Resend API: " + ex.getMessage());
        }
    }

    private void sendViaSmtp(String toEmail, String subject, String bodyContent) {
        try {
            if (mailSender == null) {
                System.err.println("⚠️ SMTP JavaMailSender not configured.");
                return;
            }
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(toEmail.trim());
            helper.setSubject(subject);
            helper.setText(bodyContent, true);

            mailSender.send(message);
        } catch (Exception ex) {
            System.err.println("⚠️ Email notification failed (Cloud SMTP blocked/restricted): " + ex.getMessage());
        }
    }

    private String toJsonString(String text) {
        if (text == null) return "\"\"";
        StringBuilder sb = new StringBuilder("\"");
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            switch (c) {
                case '"':  sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b");  break;
                case '\f': sb.append("\\f");  break;
                case '\n': sb.append("\\n");  break;
                case '\r': sb.append("\\r");  break;
                case '\t': sb.append("\\t");  break;
                default:
                    if (c < ' ') {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
            }
        }
        sb.append("\"");
        return sb.toString();
    }

    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}


