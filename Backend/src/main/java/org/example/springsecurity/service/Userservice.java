package org.example.springsecurity.service;

import lombok.extern.slf4j.Slf4j;
import org.example.springsecurity.dto.RegisterRequest;
import org.example.springsecurity.model.User;
import org.example.springsecurity.repo.Userrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
public class Userservice {

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    private Userrepo userRepository;

    @Transactional
    public User createUser(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        log.info("User created successfully with email: {}", request.getEmail());
        return savedUser;
    }

    public User savUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional
    public void verifyUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        user.setEmailVerified(true);
        userRepository.save(user);
        log.info("Email verified for user: {}", email);
    }

    public boolean validateCredentials(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }
        return bCryptPasswordEncoder.matches(password, user.getPassword());
    }

    public boolean isEmailVerified(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return user != null && user.isEmailVerified();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password updated for user: {}", email);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Add these missing methods that your controller is calling
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}