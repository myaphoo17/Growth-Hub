package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Service.ChatMessageService;
import com.E_Learnig.System.Model.RecipientSenderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chatMessage")
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @PostMapping("/getChat")
    public ResponseEntity<?> getMessageBySenderAndRecipient(@RequestBody RecipientSenderDto recipientSenderDto){
        return ResponseEntity.ok(chatMessageService.getMessageBySenderAndRecipient(recipientSenderDto.getSenderStaffId(), recipientSenderDto.getRecipientStaffId()));
    }
}
