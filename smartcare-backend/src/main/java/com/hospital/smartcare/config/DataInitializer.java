package com.hospital.smartcare.config;

import com.hospital.smartcare.entity.User;
import com.hospital.smartcare.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@smartcare.com")) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@smartcare.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setEnabled(true);

            userRepository.save(admin);
            log.info("Default admin created: admin@smartcare.com / admin123");
        }
        
        if (!userRepository.existsByEmail("dwarak@smartcare.com")) {
            User admin2 = new User();
            admin2.setName("Dwarak Admin");
            admin2.setEmail("dwarak@smartcare.com");
            admin2.setPassword(passwordEncoder.encode("dwarak123"));
            admin2.setRole(User.Role.ADMIN);
            admin2.setEnabled(true);
            userRepository.save(admin2);
            log.info("Additional admin created: dwarak@smartcare.com / dwarak123");
        }
    }
}
