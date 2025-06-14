package com.aclc.eventmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EventManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventManagementApplication.class, args);
    }
}
