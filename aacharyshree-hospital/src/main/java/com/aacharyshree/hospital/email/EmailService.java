package com.aacharyshree.hospital.email;

import com.aacharyshree.hospital.entity.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromName;
    private final String logoUrl;
    private final String fromAddress;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from-name}") String fromName,
            @Value("${app.mail.logo-url}") String logoUrl,
            @Value("${spring.mail.username}") String fromAddress
    ) {
        this.mailSender = mailSender;
        this.fromName = fromName;
        this.logoUrl = logoUrl;
        this.fromAddress = fromAddress;
    }

    private void send(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            helper.setFrom(fromAddress, fromName);
            mailSender.send(message);
        } catch (Exception e) {
            // A failed email should never block the actual transaction (OTP
            // still works via the API response in dev; a payment is already
            // confirmed regardless of whether the receipt email sends) —
            // so this only logs, it never throws back to the caller.
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    private String wrapper(String bodyHtml) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
              <div style="background: linear-gradient(to right, #47C5B9, #26AFDE); padding: 24px; text-align: center;">
                %s
              </div>
              <div style="padding: 32px 28px; color: #1f2937;">
                %s
              </div>
              <div style="padding: 20px 28px; background: #f8fafc; text-align: center; color: #94a3b8; font-size: 12px;">
                Aacharyshree Hospital · This is an automated message, please do not reply.
              </div>
            </div>
            """.formatted(
                StringUtils.hasText(logoUrl)
                    ? "<img src=\"" + logoUrl + "\" alt=\"Aacharyshree Hospital\" style=\"height: 48px;\" />"
                    : "<span style=\"color: white; font-size: 20px; font-weight: bold;\">Aacharyshree Hospital</span>",
                bodyHtml
        );
    }

    public void sendOtp(String toEmail, String otp) {
        String body = """
            <h2 style="color: #0f2742; margin-top: 0;">Your Login Code</h2>
            <p>Use this code to log in or complete your registration:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; color: #26AFDE; background: #F8FAFD; padding: 16px; border-radius: 8px; margin: 20px 0;">
              %s
            </div>
            <p style="color: #64748b; font-size: 14px;">This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
            """.formatted(otp);
        send(toEmail, "Your Aacharyshree Hospital login code: " + otp, wrapper(body));
    }

    public void sendOrderConfirmation(Order order) {
        StringBuilder items = new StringBuilder();
        for (var item : order.getItems()) {
            items.append("""
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">%s × %d</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">₹%.2f</td>
                </tr>
                """.formatted(item.getProductName(), item.getQuantity(), item.getSubtotal()));
        }

        String body = """
            <h2 style="color: #0f2742; margin-top: 0;">Order Confirmed!</h2>
            <p>Hi %s, thank you for your order. Here's a summary:</p>
            <p style="color: #64748b;">Order #%d</p>
            <table style="width: 100%%; border-collapse: collapse; margin: 16px 0;">
              %s
              <tr>
                <td style="padding: 12px 0; font-weight: bold;">Total</td>
                <td style="padding: 12px 0; font-weight: bold; text-align: right;">₹%.2f</td>
              </tr>
            </table>
            <p style="color: #64748b; font-size: 14px;">Keep your Order ID and phone number handy — you'll need both to track your order on our website.</p>
            """.formatted(order.getCustomerName(), order.getId(), items, order.getTotalAmount());

        if (order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank()) {
            send(order.getCustomerEmail(), "Order Confirmed — #" + order.getId(), wrapper(body));
        }
    }

    public void sendDeliveryConfirmation(Order order) {
        String body = """
            <h2 style="color: #0f2742; margin-top: 0;">Your Order Has Been Delivered</h2>
            <p>Hi %s, your order #%d has been marked as delivered. We hope you're doing well!</p>
            """.formatted(order.getCustomerName(), order.getId());

        if (order.getCustomerEmail() != null && !order.getCustomerEmail().isBlank()) {
            send(order.getCustomerEmail(), "Delivered — Order #" + order.getId(), wrapper(body));
        }
    }
}
