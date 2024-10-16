package com.E_Learnig.System.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "exam")
public class ExamDTO {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long id;

        @Column(nullable = false)
        private String title;

        @Lob
        private String description;

        @Column(name = "created_date", nullable = false, updatable = false)
        private LocalDateTime createdDate;

        @Column(name = "updated_date", nullable = false)
        private LocalDateTime updatedDate;

        @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonManagedReference
        private List<QuestionDTO> questions;




        @Column(name = "deleted", nullable = false)
        private boolean deleted = false;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "course_id", nullable = false)
        private CourseDTO course;

        // Ensure proper initialization of dates
        @PrePersist
        protected void onCreate() {
                this.createdDate = LocalDateTime.now();
                this.updatedDate = LocalDateTime.now();
        }

        @PreUpdate
        protected void onUpdate() {
                this.updatedDate = LocalDateTime.now();
        }
        // No-argument constructor
        public ExamDTO() {
        }
}
