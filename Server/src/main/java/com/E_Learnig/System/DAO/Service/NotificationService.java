package com.E_Learnig.System.DAO.Service;


import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Repository.NotificationRepository;
import com.E_Learnig.System.DAO.SecurityService.NotificationInterface;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.Notification;
import com.E_Learnig.System.DTO.enm.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService implements NotificationInterface {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmployeeRepository userRepository;

    @Override
    public Notification createNotification(EmployeeDTO sender, EmployeeDTO recipient, String message) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setUserFrom(sender);
        notification.setMessage(message);
        notification.setIsRead(false);
        return notification;
    }

    @Override
    public ResponseEntity<?> getNotificationsForUser(String staffId) {
        try{
            EmployeeDTO user = userRepository.findByStaffId(staffId);
            return ResponseEntity.ok(notificationRepository.findByRecipientOrderByCreatedAtDesc(user)) ;
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @Override
    public ResponseEntity<?> markNotificationAsRead(String recipientId, String userFromId, String typeNotification, Number idPost) {
        try {
            long receive = Long.parseLong(recipientId);
            long from = Long.parseLong(userFromId);
            EmployeeDTO recipient = userRepository.findBySr(receive);
            EmployeeDTO userFrom = userRepository.findBySr(from);

            Notification notification;

            // Check if idPost is null or has a specific value
            if (idPost != null) {
                long longNumber = idPost.longValue();
                if (longNumber > 0) {
                    notification = notificationRepository.findByRecipientAndUserFromAndNotificationTypeAndIdPost(recipient, userFrom, NotificationType.valueOf(typeNotification), longNumber)
                            .orElseThrow(ChangeSetPersister.NotFoundException::new);
                } else {
                    notification = notificationRepository.findByRecipientAndUserFromAndNotificationType(recipient, userFrom, NotificationType.valueOf(typeNotification))
                            .orElseThrow(ChangeSetPersister.NotFoundException::new);
                }
            } else {
                // Handle the case when idPost is null
                notification = notificationRepository.findByRecipientAndUserFromAndNotificationType(recipient, userFrom, NotificationType.valueOf(typeNotification))
                        .orElseThrow(ChangeSetPersister.NotFoundException::new);
            }

            notification.setIsRead(true);
            notificationRepository.save(notification);
            System.out.println("Notification read status updated to true");

            return ResponseEntity.ok("Notification has been read");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @Override
    public Notification markNotificationAsUnread(long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setIsRead(false);
            return notificationRepository.save(notification);
        }
        return null;
    }


}
