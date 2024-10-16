package com.E_Learnig.System.DTO;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "options")
public class OptionDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private QuestionDTO question;

//    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference
//    private List<StudentAnswerDTO> student;

    @Column(nullable = false)
    private String multiple;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    @Column(name = "points", nullable = false)
    private int points;

    public boolean isCorrect() {
        return isCorrect;
    }

    // No-argument constructor
    public OptionDTO() {}

}

