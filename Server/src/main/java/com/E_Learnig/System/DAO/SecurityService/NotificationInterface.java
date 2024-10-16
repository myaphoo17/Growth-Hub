package com.E_Learnig.System.DAO.SecurityService;


import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.Notification;
import org.springframework.http.ResponseEntity;

public interface NotificationInterface {

    Notification createNotification(EmployeeDTO Sender, EmployeeDTO recipient, String message);
    ResponseEntity<?> getNotificationsForUser(String idUser);

    ResponseEntity<?> markNotificationAsRead(String recipientId, String userFromId, String typeNotification, Number idPost);

    public Notification markNotificationAsUnread(long notificationId);

}