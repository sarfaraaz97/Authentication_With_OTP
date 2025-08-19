package org.example.springsecurity.service;

import lombok.extern.slf4j.Slf4j;
import org.example.springsecurity.model.OtpRecord;
import org.example.springsecurity.repo.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    private final SecureRandom random = new SecureRandom();
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;

    public String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    @Transactional
    public void sendOtp(String email, OtpRecord.OtpType type) {
        // Mark all existing OTPs for this email as used
        otpRepository.markAllOtpsAsUsedForEmail(email);

        // Generate new OTP
        String otp = generateOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        // Save OTP record
        OtpRecord otpRecord = new OtpRecord();
        otpRecord.setEmail(email);
        otpRecord.setOtp(otp);
        otpRecord.setExpiryTime(expiryTime);
        otpRecord.setType(type);
        otpRecord.setUsed(false);
        otpRecord.setCreatedAt(LocalDateTime.now());

        otpRepository.save(otpRecord);

        // Send email asynchronously
        sendOtpEmailAsync(email, otp, type.toString().toLowerCase());

        log.info("OTP generated and sent for email: {}", email);
    }

    // Method that your controller is calling
    public String generateAndSendOtp(String email) {
        try {
            // Mark all existing OTPs for this email as used
            otpRepository.markAllOtpsAsUsedForEmail(email);

            // Generate new OTP
            String otp = generateOtp();
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

            // Save OTP record
            OtpRecord otpRecord = new OtpRecord();
            otpRecord.setEmail(email);
            otpRecord.setOtp(otp);
            otpRecord.setExpiryTime(expiryTime);
            otpRecord.setType(OtpRecord.OtpType.LOGIN);
            otpRecord.setUsed(false);
            otpRecord.setCreatedAt(LocalDateTime.now());

            otpRepository.save(otpRecord);

            // Send email asynchronously
            sendOtpEmailAsync(email, otp, "login");

            log.info("OTP generated and sent for email: {}", email);
            return "OTP sent successfully to your email.";
        } catch (Exception e) {
            log.error("Failed to generate and send OTP for email: {}", email, e);
            throw new RuntimeException("Failed to send OTP");
        }
    }

    @Async
    protected void sendOtpEmailAsync(String email, String otp, String purpose) {
        try {
            emailService.sendOtpEmail(email, otp, purpose);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", email, e);
        }
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpRecord> otpRecordOpt = otpRepository
                .findByEmailAndOtpAndUsedFalseAndExpiryTimeAfter(email, otp, LocalDateTime.now());

        if (otpRecordOpt.isPresent()) {
            OtpRecord otpRecord = otpRecordOpt.get();
            otpRecord.setUsed(true);
            otpRepository.save(otpRecord);

            log.info("OTP verified successfully for email: {}", email);
            return true;
        }

        log.warn("OTP verification failed for email: {}", email);
        return false;
    }

    public boolean hasValidOtp(String email) {
        Optional<OtpRecord> otpRecord = otpRepository
                .findTopByEmailAndUsedFalseAndExpiryTimeAfterOrderByCreatedAtDesc(
                        email, LocalDateTime.now());
        return otpRecord.isPresent();
    }

    // Cleanup expired OTPs every hour
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional
    public void cleanupExpiredOtps() {
        otpRepository.deleteExpiredOtps(LocalDateTime.now());
        log.debug("Cleaned up expired OTPs");
    }
}