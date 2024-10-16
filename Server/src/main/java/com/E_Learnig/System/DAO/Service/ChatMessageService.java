package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.ChatMessageRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.NotificationRepository;
import com.E_Learnig.System.DAO.SecurityService.ChatMessageInterface;
import com.E_Learnig.System.DTO.ChatMessage;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.Notification;
import com.E_Learnig.System.DTO.enm.MessageType;
import com.E_Learnig.System.DTO.enm.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class ChatMessageService implements ChatMessageInterface {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private EmployeeRepository employerRepository;

    @Override
    public ChatMessage createMessage(String userFromId, String recipientId, String content, String typeMessage) {
        try {
            EmployeeDTO recipient = employeeRepository.findByStaffId(recipientId);
            EmployeeDTO sender = employeeRepository.findByStaffId(userFromId);

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setRecipient(recipient);
            chatMessage.setSender(sender);
            chatMessage.setType(MessageType.valueOf(typeMessage));
            chatMessage.setContent(content);

            if (!Objects.equals(sender.getSr(), recipient.getSr())) {
                notificationRepository.findByRecipientAndUserFromAndNotificationType(recipient, sender, NotificationType.MESSAGE)
                        .ifPresent(notification -> notificationRepository.deleteById(notification.getId()));

                Notification notification = new Notification();
                notification.setUserFrom(sender);
                notification.setIdPost(null);
                notification.setIsRead(false);
                notification.setRecipient(recipient);
                notification.setMessage(sender.getName() + " sent you a message");
                notification.setNotificationType(NotificationType.MESSAGE);
                notification.setEmailFrom(sender.getEmail());
                notificationRepository.save(notification);
            }

            return chatMessageRepository.save(chatMessage);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @Override
    public void deleteMessage(Long messageId) {
        chatMessageRepository.deleteById(messageId);
    }

    @Override
    public ResponseEntity<?> getMessageBySenderAndRecipient(String userFromId, String recipientId) {
        try {
            EmployeeDTO recipient = employeeRepository.findByStaffId(recipientId);
            EmployeeDTO sender = employeeRepository.findByStaffId(userFromId);

            return ResponseEntity.ok(chatMessageRepository.findAllBySenderAndRecipientOrSenderAndRecipientOrderByCreatedAt(sender, recipient, recipient, sender));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }
}
