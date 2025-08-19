package org.example.springsecurity.repo;

import org.example.springsecurity.model.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpRecord, Long> {

    Optional<OtpRecord> findByEmailAndOtpAndUsedFalseAndExpiryTimeAfter(
            String email, String otp, LocalDateTime currentTime);

    @Modifying
    @Transactional
    @Query("DELETE FROM OtpRecord o WHERE o.expiryTime < :currentTime")
    void deleteExpiredOtps(@Param("currentTime") LocalDateTime currentTime);

    @Modifying
    @Transactional
    @Query("UPDATE OtpRecord o SET o.used = true WHERE o.email = :email AND o.used = false")
    void markAllOtpsAsUsedForEmail(@Param("email") String email);

    Optional<OtpRecord> findTopByEmailAndUsedFalseAndExpiryTimeAfterOrderByCreatedAtDesc(
            String email, LocalDateTime currentTime);
}