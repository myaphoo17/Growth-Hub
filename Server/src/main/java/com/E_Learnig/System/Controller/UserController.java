package com.E_Learnig.System.Controller;


import com.E_Learnig.System.DAO.Service.EmployeeService;
import com.E_Learnig.System.Model.EmployeeModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/user")
public class UserController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping(value = "/employerlist", produces = "application/json")
    public List<EmployeeModel> getAllEmployee(ModelMap model) {
        return employeeService.getAllEmployees();
    }
    @GetMapping(value = "/studentlist", produces = "application/json")
    public List<EmployeeModel> getStudent(ModelMap model) {
        return employeeService.getStudentEmployer();
    }

    @GetMapping("/staffId/{staffId}")
    public ResponseEntity<EmployeeModel> getUserByStaffId(@PathVariable String staffId) {
        EmployeeModel employeeModel = employeeService.getUserByStaffId(staffId);
        if (employeeModel != null) {
            return ResponseEntity.ok(employeeModel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
