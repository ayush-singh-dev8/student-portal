package com.springBoot.student_portal_backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String studentId;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String address;
} 