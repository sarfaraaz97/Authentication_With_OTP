package org.example.springsecurity.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.springsecurity.dto.*;
import org.example.springsecurity.model.OtpRecord;
import org.example.springsecurity.model.User;
import org.example.springsecurity.service.JwtService;
import org.example.springsecurity.service.OtpService;
import org.example.springsecurity.service.Userservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    @Autowired
    private Userservice userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Check if user already exists
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Email already registered", null));
            }

            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Username already taken", null));
            }

            // Create user
            User user = userService.createUser(request);

            // Send OTP for email verification
            otpService.sendOtp(user.getEmail(), OtpRecord.OtpType.REGISTRATION);

            return ResponseEntity.ok(new ApiResponse<>(true,
                    "Registration successful. Please check your email for OTP verification.",
                    null));

        } catch (Exception e) {
            log.error("Registration failed", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "Registration failed", null));
        }
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<ApiResponse<String>> verifyRegistration(@Valid @RequestBody OtpVerificationRequest request) {
        try {
            if (otpService.verifyOtp(request.getEmail(), request.getOtp())) {
                userService.verifyUserEmail(request.getEmail());
                return ResponseEntity.ok(new ApiResponse<>(true,
                        "Email verified successfully. You can now login.", null));
            } else {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Invalid or expired OTP", null));
            }
        } catch (Exception e) {
            log.error("Email verification failed", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "Verification failed", null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@Valid @RequestBody LoginRequest request) {
        try {
            // Validate user credentials
            if (!userService.validateCredentials(request.getEmail(), request.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Invalid email or password", null));
            }

            // Check if email is verified
            if (!userService.isEmailVerified(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Email not verified. Please verify your email first.", null));
            }

            // Send OTP for login
            otpService.sendOtp(request.getEmail(), OtpRecord.OtpType.LOGIN);

            return ResponseEntity.ok(new ApiResponse<>(true,
                    "OTP sent to your email. Please verify to complete login.", null));

        } catch (Exception e) {
            log.error("Login failed", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "Login failed", null));
        }
    }

    @PostMapping("/verify-login")
    public ResponseEntity<ApiResponse<LoginResponse>> verifyLogin(@Valid @RequestBody OtpVerificationRequest request) {
        try {
            if (otpService.verifyOtp(request.getEmail(), request.getOtp())) {
                // Generate JWT token
                User user = userService.getUserByEmail(request.getEmail());
                String token = jwtService.generateToken(user.getUsername());

                LoginResponse loginResponse = new LoginResponse();
                loginResponse.setToken(token);
                loginResponse.setUsername(user.getUsername());
                loginResponse.setEmail(user.getEmail());

                return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", loginResponse));
            } else {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Invalid or expired OTP", null));
            }
        } catch (Exception e) {
            log.error("Login verification failed", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "Login verification failed", null));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        try {
            if (!userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Email not found", null));
            }

            OtpRecord.OtpType type = request.getType() != null ?
                    OtpRecord.OtpType.valueOf(request.getType().toUpperCase()) :
                    OtpRecord.OtpType.LOGIN;

            otpService.sendOtp(request.getEmail(), type);

            return ResponseEntity.ok(new ApiResponse<>(true, "OTP resent successfully", null));

        } catch (Exception e) {
            log.error("Resend OTP failed", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "Failed to resend OTP", null));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            if (!userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Email not found", null));
            }

            otpService.sendOtp(request.getEmail(), OtpRecord.OtpType.LOGIN);

            return ResponseEntity.ok(new ApiResponse<>(true,
                    "Password reset OTP sent to your email", null));

        } catch (Exception e) {
            log.error("Forgot password failed", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "Failed to process password reset", null));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            if (otpService.verifyOtp(request.getEmail(), request.getOtp())) {
                userService.updatePassword(request.getEmail(), request.getNewPassword());
                return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successfully", null));
            } else {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Invalid or expired OTP", null));
            }
        } catch (Exception e) {
            log.error("Password reset failed", e);
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "Password reset failed", null));
        }
    }
}