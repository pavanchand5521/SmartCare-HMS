package com.hospital.smartcare.repository;

import com.hospital.smartcare.entity.Doctor;
import com.hospital.smartcare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByStatus(String status);
    List<Doctor> findBySpecialization(String specialization);
}
