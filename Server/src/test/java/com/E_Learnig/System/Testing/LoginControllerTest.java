package com.E_Learnig.System.Testing;

import com.E_Learnig.System.Component.JwtUtil;
import com.E_Learnig.System.Controller.LoginController;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.Model.EmployeeModel;
import com.E_Learnig.System.Model.ForgetPassModel;
import com.E_Learnig.System.Model.LoginModel;
import com.E_Learnig.System.DAO.Service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
public class LoginControllerTest {

    @Mock
    private EmployeeService employeeService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private LoginController loginController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        loginController = new LoginController(employeeService, jwtUtil);
    }

    @Test
    public void testLogin_Success() {
        // Arrange
        LoginModel loginModel = new LoginModel();
        loginModel.setStaffId("26-99936");
        loginModel.setPassword("dat123");

        when(employeeService.checkingStaffId(anyString())).thenReturn(true);
        when(employeeService.checkingPasswordAndId(anyString(), anyString())).thenReturn(true);

        EmployeeModel employeeModel = new EmployeeModel();
        employeeModel.setStatus("Active");
        employeeModel.setRole("Admin");
        employeeModel.setDefaultPasswordChange(false);
        employeeModel.setSr(1L);
        when(employeeService.getProfileByStaffId(anyString())).thenReturn(employeeModel);

        // Mock the token generation
        when(jwtUtil.getSecretKey()).thenReturn("secretKey");
        when(jwtUtil.createToken(anyString())).thenCallRealMethod();

        // Act
        ResponseEntity<EmployeeModel> response = loginController.login(loginModel);

        // Print the response data for debugging
        System.out.println("Response Status Code: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());

        // Assert
        assertNotNull(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode()); // Assuming successful login should return OK
        assertEquals("Admin", response.getBody().getRole());
        assertFalse(response.getBody().isDefaultPasswordChange());
        assertNotNull(response.getBody().getToken());
        assertEquals("26-99936", response.getBody().getStaffId());
        assertEquals("1", response.getBody().getDbId());
    }

    @Test
    public void testLogin_InvalidStaffId() {
        // Arrange
        LoginModel loginModel = new LoginModel();
        loginModel.setStaffId("invalidStaffId");
        loginModel.setPassword("validPassword");

        when(employeeService.checkingStaffId(anyString())).thenReturn(false);

        // Act
        ResponseEntity<EmployeeModel> response = loginController.login(loginModel);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("ID Wrong", response.getBody().getErrorMessage());
    }

    @Test
    public void testLogin_InvalidPassword() {
        // Arrange
        LoginModel loginModel = new LoginModel();
        loginModel.setStaffId("validStaffId");
        loginModel.setPassword("invalidPassword");

        // Ensure mocks return the correct values
        when(employeeService.checkingStaffId(anyString())).thenReturn(true);
        when(employeeService.checkingPasswordAndId(anyString(), anyString())).thenReturn(false);

        // Debugging mock behavior
        System.out.println("Mock checkingStaffId: " + employeeService.checkingStaffId("validStaffId"));
        System.out.println("Mock checkingPasswordAndId: " + employeeService.checkingPasswordAndId("validStaffId", "invalidPassword"));

        // Act
        ResponseEntity<EmployeeModel> response = loginController.login(loginModel);

        // Debugging statements
        System.out.println("Actual status code: " + response.getStatusCode());
        System.out.println("Actual error message: " + response.getBody().getErrorMessage());

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Password Is Wrong !", response.getBody().getErrorMessage());
    }

    @Test
    public void testLogin_InactiveAccount() {
        // Arrange
        LoginModel loginModel = new LoginModel();
        loginModel.setStaffId("validStaffId");
        loginModel.setPassword("validPassword");

        when(employeeService.checkingStaffId(anyString())).thenReturn(true);
        when(employeeService.checkingPasswordAndId(anyString(), anyString())).thenReturn(true);

        EmployeeModel employeeModel = new EmployeeModel();
        employeeModel.setStatus("UnActive");
        when(employeeService.getProfileByStaffId(anyString())).thenReturn(employeeModel);

        // Act
        ResponseEntity<EmployeeModel> response = loginController.login(loginModel);

        // Debugging print statements
        System.out.println("Response Status Code: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Your Account Is Temporary Closed !", response.getBody().getErrorMessage());
    }

    @Test
    public void testForgotPassword_EmailNotFound() {
        String email = "nonexistent@example.com";
        ForgetPassModel responseModel = new ForgetPassModel();
        responseModel.setMessage("Email not found");

        when(employeeService.sendOtp(anyString())).thenReturn(responseModel);

        ResponseEntity<ForgetPassModel> response = loginController.forgotPassword(email);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Email not found", response.getBody().getMessage());
    }

    @Test
    public void testUpdateEmployer_Success() {
        ForgetPassModel forgetPassModel = new ForgetPassModel();
        forgetPassModel.setEmail("example@example.com");
        forgetPassModel.setOtp("123456");
        forgetPassModel.setNewPass("newPassword");

        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setEmail("example@example.com");

        when(employeeService.updatePassword(any(ForgetPassModel.class))).thenReturn(employeeDTO);

        ResponseEntity<EmployeeDTO> response = loginController.updateEmployer(forgetPassModel);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("example@example.com", response.getBody().getEmail());
    }


    @Test
    public void testChangePassword_Success() {
        String newPass = "newPassword";
        String staffId = "validStaffId";

        // Mock the changePassword method to return 0 (indicating success)
        when(employeeService.changePassword(anyString(), anyString())).thenReturn(0);

        // Act
        ResponseEntity<?> response = loginController.updateEmployer(newPass, staffId);

        // Print the response data for debugging
        System.out.println("Response Status Code: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password changed successfully", response.getBody());
    }

    @Test
    public void testChangePassword_Failure() {
        String newPass = "newPassword";
        String staffId = "validStaffId";

        // Mock the changePassword method to throw an exception
        doThrow(new RuntimeException("Failed to change password")).when(employeeService).changePassword(anyString(), anyString());

        // Act
        ResponseEntity<?> response = loginController.updateEmployer(newPass, staffId);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Failed to change password", response.getBody());
    }
}
