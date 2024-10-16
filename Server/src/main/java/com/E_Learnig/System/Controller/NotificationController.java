package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Service.NotificationService;
import com.E_Learnig.System.Model.ReadNotifDto;
import com.E_Learnig.System.Model.UserByIdReq;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/getNotification")
    public ResponseEntity<?> GetNotificationByUser(@RequestBody UserByIdReq userByIdReq){
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userByIdReq.getStaffId()));
    }
    @PostMapping("/readNotification")
    public ResponseEntity<?> readNotification(@RequestBody ReadNotifDto readNotifDto) {
        System.out.println("text read value  id post id =>" + readNotifDto.getIdPost());
//        if (readNotifDto.getIdPost() == 0) {
//            readNotifDto.setIdPost(-1);
//        }
        notificationService.markNotificationAsRead(
                readNotifDto.getStaffIdUserTo(),
                readNotifDto.getStaffIdUserFrom(),
                readNotifDto.getTypeNotif(),
                readNotifDto.getIdPost());

        return ResponseEntity.ok().build();
    }
}
