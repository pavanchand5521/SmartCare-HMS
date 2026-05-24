package com.hospital.smartcare.controller;

import com.hospital.smartcare.dto.DashboardStatsDTO;
import com.hospital.smartcare.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<DashboardStatsDTO> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<DashboardStatsDTO> getDoctorStats(@PathVariable Long doctorId) {
        return ResponseEntity.ok(dashboardService.getDoctorStats(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<DashboardStatsDTO> getPatientStats(@PathVariable Long patientId) {
        return ResponseEntity.ok(dashboardService.getPatientStats(patientId));
    }
}
