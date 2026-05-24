package com.hospital.smartcare.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    private int experience;

    private String phone;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    public Doctor() {}

    public Doctor(Long id, String name, String specialization, int experience, String phone, String status, String profileImage, User user) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.experience = experience;
        this.phone = phone;
        this.status = status;
        this.profileImage = profileImage;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
