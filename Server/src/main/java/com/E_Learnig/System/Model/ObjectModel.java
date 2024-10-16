package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ObjectModel {
    private String category;
    private String courseTitle;
    private String courseDescription;
    private String sectionTitle;
    private String courseCreatorId;
    private String courseDuration;
    private String title;
    private String description;
    private LocalDateTime dueDate;
}
