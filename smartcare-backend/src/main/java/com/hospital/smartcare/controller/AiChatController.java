package com.hospital.smartcare.controller;

import com.hospital.smartcare.dto.AiChatRequest;
import com.hospital.smartcare.dto.AiChatResponse;
import com.hospital.smartcare.service.AiChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiChatController {

    @Autowired
    private AiChatService aiChatService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        AiChatResponse response = aiChatService.processMessage(request);
        return ResponseEntity.ok(response);
    }
}
