package com.hospital.smartcare.repository;

import com.hospital.smartcare.entity.Patient;
import com.hospital.smartcare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUser(User user);
    Optional<Patient> findByUserId(Long userId);
}
