package org.example.springsecurity.controller;

import org.example.springsecurity.model.User;
import org.example.springsecurity.service.JwtService;
import org.example.springsecurity.service.Userservice;
import org.example.springsecurity.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Map;

@RestController
public class Usercontroller {
    @Autowired
    private Userservice userservice;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private OtpService otpService;
    @Autowired
    AuthenticationManager authenticationManager;

    @PostMapping("register")
    public User register(@RequestBody User user)
    {
        return userservice.savUser(user);
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody User user)
    {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

            if (authentication.isAuthenticated()) {
                // Get user details to find email
                User authenticatedUser = userservice.findByUsername(user.getUsername());
                if (authenticatedUser != null && authenticatedUser.getEmail() != null) {
                    // Send OTP to user's email
                    String otpResponse = otpService.generateAndSendOtp(authenticatedUser.getEmail());
                    return ResponseEntity.ok("Credentials verified. " + otpResponse + " Please verify OTP to complete login.");
                } else {
                    return ResponseEntity.badRequest().body("User email not found. Please update your profile.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> otpRequest) {
        String email = otpRequest.get("email");
        String otpCode = otpRequest.get("otp");

        if (email == null || otpCode == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }

        if (otpService.verifyOtp(email, otpCode)) {
            // Find user by email to generate JWT
            User user = userservice.findByEmail(email);
            if (user != null) {
                String token = jwtService.generateToken(user.getUsername());
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.badRequest().body("User not found");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
        }
    }

    @PostMapping("resend-otp")
    public ResponseEntity<String> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        // Verify user exists with this email
        User user = userservice.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("No user found with this email");
        }

        try {
            String otpResponse = otpService.generateAndSendOtp(email);
            return ResponseEntity.ok(otpResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send OTP");
        }
    }
}
