
package com.E_Learnig.System.DTO;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "certificate_results")
public class CertificateResultDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String staffId;

    @Column(nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private Long certificateId;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String grade;

    @Column(nullable = false)
    private String staffName;

    @Column(nullable = false)
    private String courseName;

    @Column(name = "image")
    private String image;
}

