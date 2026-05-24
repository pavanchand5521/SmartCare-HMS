package com.hospital.smartcare.service;

import com.hospital.smartcare.entity.Patient;
import com.hospital.smartcare.entity.User;
import com.hospital.smartcare.repository.PatientRepository;
import com.hospital.smartcare.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public Patient getPatientByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }

    public Patient getPatientByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }

    public Patient updatePatient(Long id, Patient updated) {
        Patient patient = getPatientById(id);
        patient.setName(updated.getName());
        patient.setAge(updated.getAge());
        patient.setGender(updated.getGender());
        patient.setPhone(updated.getPhone());
        patient.setAddress(updated.getAddress());
        if (updated.getProfileImage() != null) {
            patient.setProfileImage(updated.getProfileImage());
        }
        return patientRepository.save(patient);
    }
}
