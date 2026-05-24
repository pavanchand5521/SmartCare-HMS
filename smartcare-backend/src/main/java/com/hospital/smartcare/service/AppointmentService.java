package com.hospital.smartcare.service;

import com.hospital.smartcare.util.EmailTemplates;

import com.hospital.smartcare.dto.AppointmentDTO;
import com.hospital.smartcare.entity.Appointment;
import com.hospital.smartcare.entity.Doctor;
import com.hospital.smartcare.entity.Patient;
import com.hospital.smartcare.repository.AppointmentRepository;
import com.hospital.smartcare.repository.DoctorRepository;
import com.hospital.smartcare.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final EmailNotificationService emailNotificationService;

    private static final List<String> ALL_SLOTS = Arrays.asList(
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "12:00 PM",
            "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
            "04:00 PM", "04:30 PM", "05:00 PM");

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository,
                              EmailNotificationService emailNotificationService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.emailNotificationService = emailNotificationService;
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDTO bookAppointment(AppointmentDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(LocalDate.parse(dto.getAppointmentDate()));
        appointment.setSlot(dto.getSlot());
        appointment.setStatus(Appointment.Status.PENDING);
        appointment.setNotes(dto.getNotes());

        appointment = appointmentRepository.save(appointment);

        String patientEmailBody = EmailTemplates.appointmentBookedPatient(
                doctor.getName(), appointment.getAppointmentDate().toString(), appointment.getSlot());
        emailNotificationService.sendEmail(patient.getUser().getEmail(), "SmartCare - Appointment Booked", patientEmailBody);

        String doctorEmailBody = EmailTemplates.appointmentBookedDoctor(
                patient.getName(), appointment.getAppointmentDate().toString(), appointment.getSlot());
        emailNotificationService.sendEmail(doctor.getUser().getEmail(), "SmartCare - New Appointment", doctorEmailBody);

        return toDTO(appointment);
    }

    @Transactional
    public AppointmentDTO updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(Appointment.Status.valueOf(status));
        appointment = appointmentRepository.save(appointment);
        return toDTO(appointment);
    }

    @Transactional
    public AppointmentDTO addPrescription(Long id, String diagnosis, String prescription) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setDiagnosis(diagnosis);
        appointment.setPrescription(prescription);
        appointment = appointmentRepository.save(appointment);

        String patientEmailBody = EmailTemplates.prescriptionReady(
                appointment.getDoctor().getName(), appointment.getAppointmentDate().toString());
        emailNotificationService.sendEmail(appointment.getPatient().getUser().getEmail(), "SmartCare - Prescription Ready", patientEmailBody);

        return toDTO(appointment);
    }

    @Transactional
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public List<String> getAvailableSlots(Long doctorId, String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        List<Appointment> booked = appointmentRepository
                .findByDoctorIdAndAppointmentDate(doctorId, appointmentDate);

        List<String> bookedSlots = booked.stream()
                .filter(a -> a.getStatus() != Appointment.Status.CANCELLED)
                .map(Appointment::getSlot)
                .collect(Collectors.toList());

        return ALL_SLOTS.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());
    }

    private AppointmentDTO toDTO(Appointment a) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(a.getId());
        dto.setPatientId(a.getPatient().getId());
        dto.setPatientName(a.getPatient().getName());
        dto.setDoctorId(a.getDoctor().getId());
        dto.setDoctorName(a.getDoctor().getName());
        dto.setDoctorSpecialization(a.getDoctor().getSpecialization());
        dto.setAppointmentDate(a.getAppointmentDate().toString());
        dto.setSlot(a.getSlot());
        dto.setStatus(a.getStatus().name());
        dto.setNotes(a.getNotes());
        dto.setDiagnosis(a.getDiagnosis());
        dto.setPrescription(a.getPrescription());
        return dto;
    }
}
