package com.hospital.smartcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.smartcare.dto.AiChatRequest;
import com.hospital.smartcare.dto.AiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiChatService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiChatService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public AiChatResponse processMessage(AiChatRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey.trim());

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.3-70b-versatile");
            
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> systemPrompt = new HashMap<>();
            systemPrompt.put("role", "system");
            systemPrompt.put("content", "You are the SmartCare Virtual Assistant. You help users navigate the hospital management system. Keep answers professional, concise, and helpful. Always advise seeing a doctor for serious medical issues.");
            messages.add(systemPrompt);

            if (request.getMessages() != null) {
                for (AiChatRequest.Message msg : request.getMessages()) {
                    Map<String, String> messageNode = new HashMap<>();
                    messageNode.put("role", msg.getRole());
                    messageNode.put("content", msg.getContent());
                    messages.add(messageNode);
                }
            }
            
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(GROQ_API_URL, requestEntity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String reply = root.path("choices").get(0).path("message").path("content").asText();
                return new AiChatResponse(reply);
            } else {
                throw new RuntimeException("Failed to get response from Groq API");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new AiChatResponse("I apologize, but I am currently experiencing technical difficulties connecting to my AI core. Please try again later.");
        }
    }
}
