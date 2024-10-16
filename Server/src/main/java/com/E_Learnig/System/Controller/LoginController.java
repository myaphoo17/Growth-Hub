package com.E_Learnig.System.Controller;
import com.E_Learnig.System.Component.JwtUtil;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.Model.EmployeeModel;
import com.E_Learnig.System.Model.ForgetPassModel;
import com.E_Learnig.System.Model.LoginModel;
import com.E_Learnig.System.DAO.Service.EmployeeService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping ("/api")
public class LoginController {
    private final EmployeeService employeeService;
    private final JwtUtil jwtUtil;
    @Autowired
    public LoginController(EmployeeService employeeService, JwtUtil jwtUtil) {
        this.employeeService = employeeService;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<EmployeeModel> login(@RequestBody LoginModel login) {
        EmployeeModel model=new EmployeeModel();
        boolean exists = employeeService.checkingStaffId(login.getStaffId());
        if(!exists){
            model.setErrorMessage("ID Wrong");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(model);
        }
        boolean check= employeeService.checkingPasswordAndId(login.getStaffId(), login.getPassword());
        if(!check){
            model.setStaffId(login.getStaffId());
            model.setErrorMessage("Password Is Wrong !");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(model);
        }
        EmployeeModel checkingModel=employeeService.getProfileByStaffId(login.getStaffId());
        if(checkingModel.getStatus().equals("UnActive")){
            model.setErrorMessage("Your Account Is Temporary Closed !");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(model);
        }
        // Generate JWT token
        String token = generateJwtToken(login.getStaffId());

        // Set token and role in response
        model.setRole(employeeService.getProfileByStaffId(login.getStaffId()).getRole());
        model.setDefaultPasswordChange(employeeService.getProfileByStaffId(login.getStaffId()).isDefaultPasswordChange());
        model.setToken(token);
        model.setStaffId(login.getStaffId());
        model.setDbId(String.valueOf(employeeService.getProfileByStaffId(login.getStaffId()).getSr()));
        return ResponseEntity.ok(model);
    }
    public String generateJwtToken(String staffId) {
        String secretKey = jwtUtil.getSecretKey();
        System.out.println("key"+ secretKey);
        Algorithm algorithm = Algorithm.HMAC512(secretKey);
        return JWT.create()
                .withSubject(staffId)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 86400 * 1000)) // 1 day
                .sign(algorithm);
    }
    @GetMapping ("/forgot-password/{email}")
    public ResponseEntity<ForgetPassModel> forgotPassword(@PathVariable String email) {
        ForgetPassModel response = employeeService.sendOtp(email);
        if ("Email not found".equals(response.getMessage())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }
    @PutMapping("/updatePassword")
    public ResponseEntity<EmployeeDTO> updateEmployer(@RequestBody ForgetPassModel newModel) {
        EmployeeDTO updatedEmployer = employeeService.updatePassword(newModel);
        return ResponseEntity.ok(updatedEmployer);
    }
    @PostMapping("/changePassword/{newPass}/{staffId}")
    public ResponseEntity<?> updateEmployer(@PathVariable String newPass, @PathVariable String staffId) {
        try {
            employeeService.changePassword(newPass, staffId);
            return ResponseEntity.ok().body("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
