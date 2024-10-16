package com.E_Learnig.System.Model;

import com.E_Learnig.System.DTO.enm.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessagePrivateDto {
    long id;
    MessageType type;
    String content;
    UserResponse sender;
    UserResponse recipient;
    Date createdAt;
}
