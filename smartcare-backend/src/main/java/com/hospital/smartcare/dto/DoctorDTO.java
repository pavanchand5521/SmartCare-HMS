package com.hospital.smartcare.dto;

public class DoctorDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String specialization;
    private int experience;
    private String phone;
    private String status;
    private String profileImage;

    public DoctorDTO() {}

    public DoctorDTO(Long id, String name, String email, String password,
                     String specialization, int experience, String phone, String status, String profileImage) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.specialization = specialization;
        this.experience = experience;
        this.phone = phone;
        this.status = status;
        this.profileImage = profileImage;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}
