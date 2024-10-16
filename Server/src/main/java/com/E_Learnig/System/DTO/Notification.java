package com.E_Learnig.System.DTO;

import com.E_Learnig.System.DTO.enm.NotificationType;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Notification")
public class Notification {
    @PrePersist
    protected void onCreate(){
        this.createdAt=new Date(System.currentTimeMillis());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200)
    private String message;

    private Date createdAt;

    private Long idPost;

    @Column(length = 200)
    private String emailFrom;

    @Column(length = 20)
    private NotificationType notificationType;

    private Boolean isRead;

    @ManyToOne
    @JoinColumn(referencedColumnName = "sr")
    private EmployeeDTO userFrom;

    @ManyToOne
    @JoinColumn(referencedColumnName = "sr")
    private EmployeeDTO recipient;

}
