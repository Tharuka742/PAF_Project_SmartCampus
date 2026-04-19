package com.smartcampus.backend.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityWindow {
    private String day;
    private String startTime;
    private String endTime;
}