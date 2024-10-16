package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Service.ChatMessageService;
import com.E_Learnig.System.DAO.Service.NotificationService;
import com.E_Learnig.System.DTO.ChatMessage;
import com.E_Learnig.System.Model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/app")
public class WebSocketController {

    private final ChatMessageService chatMessageService;
    private final NotificationService notificationService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/notification")
    private void PrivateNotification(@Payload ChatDtoReq chatNotification) {
        String userStaffId = chatNotification.getUserStaffIdReceiver(); // assuming ChatDtoReq has getUserId method
        String destination = "/user/" + userStaffId + "/notif";
        simpMessagingTemplate.convertAndSend(destination, chatNotification);
    }

    @MessageMapping("/signal")
    public void handlePrivateSignal(@Payload SignalMessage signalMessage) {
        String recipientId = signalMessage.getReceiver();
        String destination = "/topic/" + recipientId + "/signal";
        simpMessagingTemplate.convertAndSend( destination, signalMessage);
    }

    @MessageMapping("/privateMessage")
    private void PrivateMessage(@Payload MessagePrivateDtoRequest messagePrivateDtoRequest) {
        ChatMessage chatMessage = chatMessageService.createMessage(
                messagePrivateDtoRequest.getUserFromStaffId(),
                messagePrivateDtoRequest.getRecipientStaffId(),
                messagePrivateDtoRequest.getContent(),
                messagePrivateDtoRequest.getTypeMessage()
        );

        String recipientId = chatMessage.getRecipient().getStaffId();
        String destination = "/user/" + recipientId + "/privateMessage";

        UserResponse sender = new UserResponse(
                chatMessage.getSender().getSr(),
                chatMessage.getSender().getStaffId(),
                chatMessage.getSender().getName(),
                chatMessage.getSender().getEmail(),
                chatMessage.getSender().getProfilePhotoUrl()
        );

        UserResponse recipient = new UserResponse(
                chatMessage.getRecipient().getSr(),
                chatMessage.getRecipient().getStaffId(),
                chatMessage.getRecipient().getName(),
                chatMessage.getRecipient().getEmail(),
                chatMessage.getRecipient().getProfilePhotoUrl()
        );

        MessagePrivateDto chatMessage1 = new MessagePrivateDto(
                chatMessage.getId(),
                chatMessage.getType(),
                chatMessage.getContent(),
                sender,
                recipient,
                chatMessage.getCreatedAt()
        );

        simpMessagingTemplate.convertAndSend(destination, chatMessage1);
    }
}
