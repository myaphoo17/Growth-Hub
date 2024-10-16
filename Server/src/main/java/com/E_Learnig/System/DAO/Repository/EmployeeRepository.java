package com.E_Learnig.System.DAO.Repository;

import com.E_Learnig.System.DTO.EmployeeDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<EmployeeDTO,Long> {
    EmployeeDTO findBySr(Long id);
    EmployeeDTO findByStaffId(String staffid);
    boolean existsByEmail(String email);
    boolean existsByStaffId(String staffid);
    boolean existsByStaffIdAndDefaultPassword(String staffId, String password);
    EmployeeDTO findByEmail(String email);
    List<EmployeeDTO> findByRole(@Param("role1") String role1);
    List<EmployeeDTO> findByRoleIn(List<String> roles);
    List<EmployeeDTO> findByStaffIdIn(List<String> staffIds);
}
