package com.E_Learnig.System.DTO;

import com.E_Learnig.System.DTO.enm.MessageType;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "ChatMessage")
public class ChatMessage {
    @PrePersist
    protected void onCreate(){
        this.createdAt=new Date(System.currentTimeMillis());
    }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 6)
    private MessageType type;

    @Column(length = 251)
    private String content;

    @ManyToOne
    @JoinColumn(referencedColumnName = "sr")
    private EmployeeDTO sender;

    @ManyToOne
    @JoinColumn(referencedColumnName = "sr")
    private EmployeeDTO recipient;

    private Date createdAt;


}

