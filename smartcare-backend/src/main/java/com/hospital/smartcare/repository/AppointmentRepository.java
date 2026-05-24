package com.hospital.smartcare.repository;

import com.hospital.smartcare.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
    List<Appointment> findByStatus(Appointment.Status status);
    List<Appointment> findByAppointmentDate(LocalDate date);
    long countByStatus(Appointment.Status status);
    long countByDoctorId(Long doctorId);
    long countByPatientId(Long patientId);
}
