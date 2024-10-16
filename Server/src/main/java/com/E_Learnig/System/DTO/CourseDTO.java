package com.E_Learnig.System.DTO;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "course")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CourseDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;
    private boolean isDelete;
    private boolean isApproved;
    private String description;
    private String duration;
    private LocalDate date;
    private String adminId;
    private LocalDateTime approvedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categories_id")
    private CategoriesDTO categoriesDTO;

    @OneToMany(mappedBy = "courseDTO", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<UploadFilesDTO> uploadFilesDTO;

    @ManyToOne
    @JoinColumn(name = "saved_course_id")
    private SavedCourseDTO savedCourseDTO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_creator_id")
    private EmployeeDTO employeeDTO;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ExamDTO> exams;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<GradeDTO> grade;

    @OneToMany(mappedBy = "courseDTOA", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<LearningCourseDTO> learningCourseDTO;

    @OneToMany(mappedBy = "course")
    private List<InstructorAssignment> instructorAssignments;

    public long getDurationDays() {
        if (duration == null || duration.isEmpty()) {
            return 0; // Handle null or empty duration
        }

        Pattern pattern = Pattern.compile("(\\d+)\\s*(day|days|month|months|week|weeks)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(duration);

        if (matcher.find()) {
            int value = Integer.parseInt(matcher.group(1));
            String unit = matcher.group(2).toLowerCase();

            switch (unit) {
                case "day":
                case "days":
                    return value;
                case "week":
                case "weeks":
                    return value * 7;
                case "month":
                case "months":
                    return value * 30; // Approximate days in a month
                default:
                    throw new IllegalArgumentException("Unknown duration unit: " + unit);
            }
        } else {
            throw new IllegalArgumentException("Invalid duration format: " + duration);
        }
    }
}
