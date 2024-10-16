package com.E_Learnig.System.Testing;

import com.E_Learnig.System.Controller.InstructorController;
import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Service.CloudinaryService;
import com.E_Learnig.System.DAO.Service.EducationService;
import com.E_Learnig.System.DAO.Service.EmployeeService;
import com.E_Learnig.System.DAO.Service.InstructorService;
import com.E_Learnig.System.DTO.*;
import com.E_Learnig.System.Model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
public class InstructorControllerTest {

    @InjectMocks
    private InstructorController instructorController;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private EmployeeService employeeService;

    @Mock
    private EducationService educationService;

    @Mock
    private InstructorService instructorService;

    @Mock
    private ModelMapper mapper;

    @Mock
    private EmployeeRepository employeeRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(instructorController).build();
    }

    @Test
    public void testGetProfileById() throws Exception {
        EmployeeModel employeeModel = new EmployeeModel();
        when(employeeService.getProfileByStaffId(anyString())).thenReturn(employeeModel);

        mockMvc.perform(MockMvcRequestBuilders.get("/instructor/profile/{staffId}", "staffId"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("{ }")); // Adjust expected JSON as needed
    }

    @Test
    public void testDeleteEducation() throws Exception {
        when(educationService.deleteEducation(anyLong())).thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.delete("/instructor/deleteEducation/{educationId}", "1"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testGetEducationsByEmployer() throws Exception {
        List<EducationDTO> educationDTOS = new ArrayList<>();
        when(instructorService.getEducationsByEmployer(anyLong())).thenReturn(educationDTOS);

        mockMvc.perform(MockMvcRequestBuilders.get("/instructor/getEducations/{dbId}", "1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("[]")); // Adjust expected JSON as needed
    }

    @Test
    public void testGetAllCourses() throws Exception {
        List<CourseModel> courseModels = new ArrayList<>();
        when(instructorService.getAllCourses()).thenReturn(courseModels);

        mockMvc.perform(MockMvcRequestBuilders.get("/instructor/courseList"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("[]")); // Adjust expected JSON as needed
    }

    @Test
    public void testGetCoureListById() throws Exception {
        List<UploadFilesModel> uploadFilesModels = new ArrayList<>();
        when(instructorService.getUploadFilesById(anyLong())).thenReturn(uploadFilesModels);

        mockMvc.perform(MockMvcRequestBuilders.get("/instructor/courseListById/{courseId}", "1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("[]")); // Adjust expected JSON as needed
    }


    @Test
    public void testDeleteUploadFile() throws Exception {
        when(instructorService.deleteUploadFile(anyLong())).thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.delete("/instructor/deleteUploadFile/{fileId}", "1"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void testSaveOneVideoFile() throws Exception {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getContentType()).thenReturn("video/mp4");
        when(cloudinaryService.uploadFile(any(MultipartFile.class)))
                .thenReturn(Collections.singletonMap("url", "http://example.com/video.mp4"));

        mockMvc.perform(MockMvcRequestBuilders.multipart("/instructor/saveOneVideoFile")
                        .file("file", "test".getBytes())
                        .param("courseId", "1")
                        .param("title", "Video Title"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
