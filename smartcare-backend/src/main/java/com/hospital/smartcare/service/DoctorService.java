package com.hospital.smartcare.service;

import com.hospital.smartcare.dto.DoctorDTO;
import com.hospital.smartcare.entity.Doctor;
import com.hospital.smartcare.entity.User;
import com.hospital.smartcare.repository.DoctorRepository;
import com.hospital.smartcare.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository, UserRepository userRepository,
                         PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getActiveDoctors() {
        return doctorRepository.findByStatus("ACTIVE").stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return toDTO(doctor);
    }

    @Transactional
    public DoctorDTO createDoctor(DoctorDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(User.Role.DOCTOR);
        user.setEnabled(true);
        user = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());
        doctor.setPhone(dto.getPhone());
        doctor.setStatus("ACTIVE");
        doctor.setUser(user);
        doctor = doctorRepository.save(doctor);

        return toDTO(doctor);
    }

    @Transactional
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setExperience(dto.getExperience());
        doctor.setPhone(dto.getPhone());
        if (dto.getStatus() != null) {
            doctor.setStatus(dto.getStatus());
        }
        if (dto.getProfileImage() != null) {
            doctor.setProfileImage(dto.getProfileImage());
        }

        User user = doctor.getUser();
        user.setName(dto.getName());
        userRepository.save(user);

        doctor = doctorRepository.save(doctor);
        return toDTO(doctor);
    }

    @Transactional
    public void deactivateDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus("INACTIVE");
        doctor.getUser().setEnabled(false);
        doctorRepository.save(doctor);
        userRepository.save(doctor.getUser());
    }

    public DoctorDTO getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return toDTO(doctor);
    }

    private DoctorDTO toDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setEmail(doctor.getUser().getEmail());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setExperience(doctor.getExperience());
        dto.setPhone(doctor.getPhone());
        dto.setStatus(doctor.getStatus());
        dto.setProfileImage(doctor.getProfileImage());
        return dto;
    }
}
