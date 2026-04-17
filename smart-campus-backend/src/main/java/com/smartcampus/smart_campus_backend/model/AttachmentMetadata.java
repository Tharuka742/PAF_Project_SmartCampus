package com.smartcampus.smart_campus_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentMetadata {

    private String originalFileName;
    private String storedFileName;
    private String contentType;
    private long fileSize;
    private String fileUrl;
}