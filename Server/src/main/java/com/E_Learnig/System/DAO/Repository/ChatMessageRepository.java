package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.ChatMessage;
import com.E_Learnig.System.DTO.EmployeeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {


    List<ChatMessage> findAllBySenderAndRecipientOrSenderAndRecipientOrderByCreatedAt(EmployeeDTO sender1, EmployeeDTO recipient1, EmployeeDTO sender2, EmployeeDTO recipient2);
}
