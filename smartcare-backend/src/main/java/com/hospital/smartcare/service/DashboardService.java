package com.hospital.smartcare.service;

import com.hospital.smartcare.dto.DashboardStatsDTO;
import com.hospital.smartcare.entity.Appointment;
import com.hospital.smartcare.repository.AppointmentRepository;
import com.hospital.smartcare.repository.DoctorRepository;
import com.hospital.smartcare.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DashboardService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardService(DoctorRepository doctorRepository, PatientRepository patientRepository,
                            AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public DashboardStatsDTO getAdminStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalDoctors(doctorRepository.count());
        stats.setTotalPatients(patientRepository.count());
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setPendingAppointments(appointmentRepository.countByStatus(Appointment.Status.PENDING));
        stats.setTodayAppointments(appointmentRepository.findByAppointmentDate(LocalDate.now()).size());
        stats.setCompletedAppointments(appointmentRepository.countByStatus(Appointment.Status.COMPLETED));
        stats.setCancelledAppointments(appointmentRepository.countByStatus(Appointment.Status.CANCELLED));
        return stats;
    }

    public DashboardStatsDTO getDoctorStats(Long doctorId) {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalAppointments(appointmentRepository.countByDoctorId(doctorId));
        stats.setPendingAppointments(appointmentRepository.findByDoctorId(doctorId).stream()
                .filter(a -> a.getStatus() == Appointment.Status.PENDING).count());
        stats.setTodayAppointments(appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, LocalDate.now()).size());
        stats.setCompletedAppointments(appointmentRepository.findByDoctorId(doctorId).stream()
                .filter(a -> a.getStatus() == Appointment.Status.COMPLETED).count());
        return stats;
    }

    public DashboardStatsDTO getPatientStats(Long patientId) {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalAppointments(appointmentRepository.countByPatientId(patientId));
        stats.setPendingAppointments(appointmentRepository.findByPatientId(patientId).stream()
                .filter(a -> a.getStatus() == Appointment.Status.PENDING).count());
        stats.setCompletedAppointments(appointmentRepository.findByPatientId(patientId).stream()
                .filter(a -> a.getStatus() == Appointment.Status.COMPLETED).count());
        return stats;
    }
}
