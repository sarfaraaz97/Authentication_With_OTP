package org.example.springsecurity.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Username is required")
    private String username;

    @Column(unique = true, nullable = true) // Make nullable initially
    @Email(message = "Invalid email format")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    private String password;

    @Column(nullable = true) // Make nullable initially
    @ColumnDefault("false")
    private Boolean emailVerified = false;

    @Column(nullable = true) // Make nullable initially
    @ColumnDefault("true")
    private Boolean enabled = true;

    @Column(nullable = true) // Make nullable initially
    @ColumnDefault("CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (emailVerified == null) {
            emailVerified = false;
        }
        if (enabled == null) {
            enabled = true;
        }
    }

    // Add getters for boolean fields to handle null values
    public boolean isEmailVerified() {
        return emailVerified != null ? emailVerified : false;
    }

    public boolean isEnabled() {
        return enabled != null ? enabled : true;
    }
}