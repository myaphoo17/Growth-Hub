package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.EmployeeRepository;
import com.E_Learnig.System.DAO.Service.CloudinaryService;
import com.E_Learnig.System.DAO.Service.EducationService;
import com.E_Learnig.System.DAO.Service.EmployeeService;
import com.E_Learnig.System.DAO.Service.InstructorService;
import com.E_Learnig.System.DTO.*;
import com.E_Learnig.System.Model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/instructor")
public class InstructorController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EducationService educationService;

    @Autowired
    private InstructorService instructorService;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    CourseRepository courseRepository;

    @GetMapping("/profile/{staffId}")
    public ResponseEntity<EmployeeModel> getProfileById(@PathVariable String staffId) {
        EmployeeModel employeeModel = employeeService.getProfileByStaffId(staffId);
        if (employeeModel != null) {
            return ResponseEntity.ok(employeeModel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/updateProfile")
    public ResponseEntity<?> updateProfilePhoto(@RequestParam("file") MultipartFile file, @RequestParam("staffId") String staffId) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Unsupported file type");
        }

        try {
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file);
            String profilePhotoUrl = (String)uploadResult.get("url");
            EmployeeModel existingEmployerModel = employeeService.getProfileByStaffId(staffId);
            if (existingEmployerModel == null) {
                return ResponseEntity.notFound().build();
            }

            // Convert EmployerModel to EmployerDTO
            EmployeeDTO existingEmployerDTO = mapper.map(existingEmployerModel, EmployeeDTO.class);
            existingEmployerDTO.setProfilePhotoUrl(profilePhotoUrl);

            EmployeeDTO updatedEmployerDTO = instructorService.updateInstructorProfile(staffId, existingEmployerDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("fileName", file.getOriginalFilename());
            response.put("fileSize", file.getSize());
            response.put("url", profilePhotoUrl);
            response.put("fileType", contentType);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed: " + e.getMessage());
        }
    }

    @PutMapping("/updateInformation/{staffId}")
    public ResponseEntity<?> updateInformation(@PathVariable String staffId, @RequestBody EmployeeDTO newEmployeeDTO) {
        boolean condition=employeeRepository.existsByEmail(newEmployeeDTO.getEmail());
        if(condition){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("E-Mail Is Already Exists.");
        }
        EmployeeDTO updatedInstructor = instructorService.updateInstructorProfile(staffId, newEmployeeDTO);
        return ResponseEntity.ok(updatedInstructor);
    }

    @PostMapping("/addEducation/{dbId}")
    public ResponseEntity<EducationDTO> addEducationToEmployer(@PathVariable String dbId, @RequestBody EducationDTO educationDTO) {
        Long id = convertToLong(dbId);
        EducationDTO addedEducation = instructorService.addEducationToEmployer(id, educationDTO);
        return ResponseEntity.ok(addedEducation);
    }


    @GetMapping("/education/{id}")
    public ResponseEntity<EducationModel> getEducationById(@PathVariable String id) {
        Long idd = convertToLong(id);
        EducationModel education = educationService.getEducationsById(idd);
        if (education != null) {
            return ResponseEntity.ok(education);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/updateEducation/{id}")
    public ResponseEntity<EducationDTO> updateEducation(@PathVariable String id, @RequestBody EducationDTO newEducationDTO) {
        Long lid = convertToLong(id);
        EducationDTO updatedEducationDTO = educationService.updateEducation(lid, newEducationDTO);
        return ResponseEntity.ok(updatedEducationDTO);
    }


    @DeleteMapping("/deleteEducation/{educationId}")
    public ResponseEntity<?> deleteEducation(@PathVariable String educationId) {
        Long lid = convertToLong(educationId);
        boolean deleted = educationService.deleteEducation(lid);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @GetMapping("/getEducations/{dbId}")
    public ResponseEntity<List<EducationDTO>> getEducationsByEmployer(@PathVariable String dbId) {
        Long id = convertToLong(dbId);
        List<EducationDTO> educationDTOS = instructorService.getEducationsByEmployer(id);
        return ResponseEntity.ok(educationDTOS);
    }
    private Long convertToLong(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid employer ID: " + id, e);
        }
    }
    @PostMapping(value = "/addCourse", consumes = "multipart/form-data")
    public ResponseEntity<?> addCourse(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("fileNames") List<String> fileNames,
            @RequestPart("object") String objectJson) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectModel object;
        try {
            object = objectMapper.readValue(objectJson, ObjectModel.class);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid JSON format");
        }

        // Validate and upload files first
        List<UploadFilesDTO> uploadFilesList = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String fileName = fileNames.get(i);
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("video/") &&
                    !contentType.equals("application/pdf") &&
                    !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                    !contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") &&
                    !contentType.equals("application/msword") &&
                    !contentType.equals("application/vnd.ms-excel") &&
                    !contentType.equals("application/vnd.ms-powerpoint") &&
                    !contentType.equals("application/vnd.openxmlformats-officedocument.presentationml.presentation"))) {
                return ResponseEntity.badRequest().body("Unsupported file type");
            }
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            try {
                // Upload file to Cloudinary
                Map uploadResult = cloudinaryService.uploadFile(file);
                UploadFilesDTO uploadFiles = new UploadFilesDTO();
                uploadFiles.setTitle(fileName);
                uploadFiles.setUrl((String) uploadResult.get("url"));
                uploadFilesList.add(uploadFiles);
            } catch (IOException e) {
                return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
            }
        }

        // Save Categories entity
        EmployeeDTO employeeDTO = new EmployeeDTO();
        EmployeeDTO dto = employeeRepository.findByStaffId(object.getCourseCreatorId());
        Long id = dto.getSr();
        String staffId = dto.getStaffId();
        employeeDTO.setSr(id);
        employeeDTO.setStaffId(staffId);

        CategoriesDTO categories = new CategoriesDTO();
        categories.setName(object.getCategory());
        CategoriesDTO savedCategories = instructorService.addCategories(categories);

        // Create and save Course entity
        CourseDTO course = new CourseDTO();
        course.setApproved(false);
        course.setDelete(false);
        course.setDate(LocalDate.now());
        course.setTitle(object.getCourseTitle());
        course.setDescription(object.getCourseDescription());
        course.setDuration(object.getCourseDuration());
        course.setCategoriesDTO(savedCategories);
        course.setEmployeeDTO(employeeDTO);
        CourseDTO savedCourse = instructorService.addCourse(course);

        // Save uploaded files associated with the course
        for (UploadFilesDTO uploadFiles : uploadFilesList) {
            uploadFiles.setCourseDTO(savedCourse);
            instructorService.uploadFiles(uploadFiles);
        }

        return ResponseEntity.ok().build();
    }
    @GetMapping(value = "/courseList", produces = "application/json")
    public List<CourseModel> getAllCourses(ModelMap model) {
        return instructorService.getAllCourses();
    }

    @GetMapping("/courseListById/{courseId}")
    public List<UploadFilesModel> getCoureListById(@PathVariable String courseId) {
        long courseIdLong = Long.parseLong(courseId);
            return instructorService.getUploadFilesById(courseIdLong);
    }
    @PostMapping("/updateVideoFile")
    public ResponseEntity<?> updateProfilePhoto (@RequestParam("file") MultipartFile file, @RequestParam("id") String fileId,@RequestParam("title") String fileTitle) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("video/"))) {
            return ResponseEntity.badRequest().body("Unsupported file type");
        }
        try {
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file);
            String url = (String)uploadResult.get("url");
            EditVideoFileModel editVideoFileModel=new EditVideoFileModel();
            editVideoFileModel.setUrl(url);
            editVideoFileModel.setId(fileId);
            editVideoFileModel.setTitle(fileTitle);
            UploadFilesDTO updateVideoFile = instructorService.updateUploadVideoFile(editVideoFileModel);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Video File Update failed: " + e.getMessage());
        }
    }
    @DeleteMapping("/deleteUploadFile/{fileId}")
    public ResponseEntity<?> deleteUploadFile(@PathVariable String fileId) {
        Long lid = convertToLong(fileId);
        boolean deleted = instructorService.deleteUploadFile(lid);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PostMapping(value = "/saveOneVideoFile")
    public ResponseEntity<?> addCourse(
            @RequestParam("file") MultipartFile file,
            @RequestParam("courseId") String courseId,
            @RequestParam("title") String fileTitle) {
        Long id = convertToLong(courseId);
        // Create and save Course entity
        CourseDTO course = new CourseDTO();
        course.setId(id);
            try {
                // Upload file to Cloudinary
                Map uploadResult = cloudinaryService.uploadFile(file);
                UploadFilesDTO uploadFiles = new UploadFilesDTO();
                uploadFiles.setTitle(fileTitle);
                uploadFiles.setUrl((String) uploadResult.get("url"));
                uploadFiles.setCourseDTO(course);
                UploadFilesDTO saveUploadFiles = instructorService.uploadFiles(uploadFiles);
            } catch (IOException e) {
                return ResponseEntity.status(500).body("new video upload failed: " + e.getMessage());
            }
        return ResponseEntity.ok().build();
    }
    @GetMapping(value = "/unApprovedCourseList", produces = "application/json")
    public List<CourseModel> getAllUnApprovedCourses(ModelMap model) {
        return instructorService.getAllUnApprovedCourses();
    }

    @GetMapping(value = "/getApprovedCourseByInstructor/{employerId}", produces = "application/json")
    public List<CourseModel> getAllCoursesById(@PathVariable String employerId) {
        Long lid = convertToLong(employerId);
        return instructorService.getAllCoursesByEmployerId(lid);
    }

    @GetMapping(value = "/getUnApprovedCourseByInstructor/{employerId}", produces = "application/json")
    public List<CourseModel> getAllUnApprovedCoursesById(@PathVariable String employerId) {
        Long lid = convertToLong(employerId);
        return instructorService.getAllUnApprovedCoursesByEmployerId(lid);
    }

    @GetMapping("/instructorExists/{courseId}/{staffId}")
    public ResponseEntity<Boolean> checkEmployeeExists(@PathVariable String courseId,@PathVariable String staffId) {
        EmployeeDTO employeeDTO = employeeRepository.findByStaffId(staffId);
        Long id = employeeDTO.getSr();
        Long cId=convertToLong(courseId);
        boolean exists = courseRepository.existsByIdAndEmployeeDTO_Sr(cId,id);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }
}
