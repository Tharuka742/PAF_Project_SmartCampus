package com.smartcampus.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/** Enables @CreatedDate and @LastModifiedDate on MongoDB entities. */
@Configuration
@EnableMongoAuditing
public class MongoAuditingConfig {
}

