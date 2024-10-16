package com.E_Learnig.System.DAO.SecurityService;

import com.E_Learnig.System.DTO.ChatMessage;
import org.springframework.http.ResponseEntity;

public interface ChatMessageInterface {


    ChatMessage createMessage(String userFromId, String recipientId, String content, String typeMessage);

    void deleteMessage(Long messageId);

    ResponseEntity<?> getMessageBySenderAndRecipient(String userFromId, String recipientId);

}
