package com.smartcampus.smart_campus_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentMetadata {
    private String fileName;
    private String fileType;
    private String fileSize;
    
}
