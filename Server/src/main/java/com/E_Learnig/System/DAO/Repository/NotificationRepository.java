package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.Notification;
import com.E_Learnig.System.DTO.enm.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Long> {

    List<Notification> findByRecipientOrderByCreatedAtDesc(EmployeeDTO recipient);

    Optional<Notification> findByRecipientAndUserFromAndNotificationTypeAndIdPost(EmployeeDTO recipient, EmployeeDTO userFrom, NotificationType notificationType, Number idPost);

    Optional<Notification> findByRecipientAndUserFromAndNotificationType(EmployeeDTO recipient, EmployeeDTO userFrom, NotificationType notificationType);

}
