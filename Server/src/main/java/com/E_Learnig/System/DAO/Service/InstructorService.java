package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.*;
import com.E_Learnig.System.DTO.*;
import com.E_Learnig.System.DTO.enm.NotificationType;
import com.E_Learnig.System.Model.CourseModel;
import com.E_Learnig.System.Model.EditVideoFileModel;
import com.E_Learnig.System.Model.UploadFilesModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InstructorService {
    @Autowired
    private EmployeeRepository employerRepository;
    @Autowired
    private EducationRepository educationRepository;
    @Autowired
    private CategoriesRepository categoriesRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UploadFilesRepository uploadFilesRepository;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private NotificationRepository notificationRepository;


    public EmployeeDTO updateInstructorProfile(String staffId, EmployeeDTO employerDTODetails) {
        EmployeeDTO existingEmployer = employerRepository.findByStaffId(staffId);
        modelMapper.map(employerDTODetails, existingEmployer);
        return modelMapper.map(employerRepository.save(existingEmployer), EmployeeDTO.class);
    }
    public EducationDTO addEducationToEmployer(Long employerId, EducationDTO educationDTO) {
        EmployeeDTO employer = employerRepository.findBySr(employerId);
        EducationDTO education = modelMapper.map(educationDTO, EducationDTO.class);
        education.setEmployeeDTO(employer);
        return modelMapper.map(educationRepository.save(education), EducationDTO.class);
    }

    public List<EducationDTO> getEducationsByEmployer(Long employerId) {
        EmployeeDTO employer = employerRepository.findBySr(employerId);
        return employer.getEducationDTO().stream()
                .map(education -> modelMapper.map(education, EducationDTO.class))
                .collect(Collectors.toList());
    }
    public CategoriesDTO addCategories(CategoriesDTO categories) {
        return categoriesRepository.save(categories);
    }
    public CourseDTO addCourse(CourseDTO course) {
        // Save the course
        CourseDTO savedCourse = courseRepository.save(course);
        // Send notification to all admins
        sendNewCourseNotificationToAdmins(course.getEmployeeDTO().getStaffId(), savedCourse);
        return savedCourse;
    }

    public void sendNewCourseNotificationToAdmins(String userFromStaffId, CourseDTO course) {
        List<EmployeeDTO> admins = employerRepository.findByRole("Admin");
        EmployeeDTO sender = employerRepository.findByStaffId(userFromStaffId);

        for (EmployeeDTO admin : admins) {
            Notification notification = new Notification();
            notification.setIdPost(course.getId());
            notification.setUserFrom(sender);
            notification.setIsRead(false);
            notification.setRecipient(admin);
            notification.setMessage(sender.getName() + " created a new course: " + course.getTitle());
            notification.setNotificationType(NotificationType.COURSECREATE);
            notification.setEmailFrom(sender.getEmail());
            notificationRepository.save(notification);
        }
    }
    public UploadFilesDTO uploadFiles(UploadFilesDTO file) {
        return uploadFilesRepository.save(file);
    }
    public List<CourseModel> getAllCourses() {
        List<CourseDTO> courses = courseRepository.findByIsApprovedTrue();

        return courses.stream().map(course -> {
            List<UploadFilesDTO> uploadFiles = uploadFilesRepository.findAllByCourseId(course.getId());
            System.out.println("upload file size " + uploadFiles.size());
            CourseModel courseModel = modelMapper.map(course, CourseModel.class);
            List<UploadFilesModel> uploadFilesModels = uploadFiles.stream()
                    .map(file -> modelMapper.map(file, UploadFilesModel.class))
                    .collect(Collectors.toList());
            courseModel.setUploadFiles(uploadFilesModels);
            return courseModel;
        }).collect(Collectors.toList());
    }
    public List<UploadFilesModel> getUploadFilesById(long id) {
        List<UploadFilesDTO> uploadFiles = uploadFilesRepository.findAllByCourseId(id);
        return uploadFiles.stream()
                .map(file -> modelMapper.map(file, UploadFilesModel.class))
                .collect(Collectors.toList());
    }
    public UploadFilesDTO updateUploadVideoFile(EditVideoFileModel model) {
        long fileId = Long.parseLong(model.getId());
        Optional<UploadFilesDTO> existingUploadFiles = uploadFilesRepository.findById(fileId);
        if (existingUploadFiles.isPresent()) {
            UploadFilesDTO files = existingUploadFiles.get();
            files.setUrl(model.getUrl());
            files.setTitle(model.getTitle());
            return uploadFilesRepository.save(files);
        } else {
            throw new IllegalArgumentException("File not found");
        }
    }
    public boolean deleteUploadFile(Long educationId) {
        uploadFilesRepository.deleteById(educationId);
        return true;
    }
    public List<CourseModel> getAllUnApprovedCourses() {
        List<CourseDTO> courses = courseRepository.findByIsApprovedFalse();

        return courses.stream().map(course -> {
            List<UploadFilesDTO> uploadFiles = uploadFilesRepository.findAllByCourseId(course.getId());
            boolean hasExam=examRepository.existsByCourseId(course.getId());
            CourseModel courseModel = modelMapper.map(course, CourseModel.class);
            List<UploadFilesModel> uploadFilesModels = uploadFiles.stream()
                    .map(file -> modelMapper.map(file, UploadFilesModel.class))
                    .collect(Collectors.toList());
            courseModel.setUploadFiles(uploadFilesModels);
            courseModel.setHasExam(hasExam);
            return courseModel;
        }).collect(Collectors.toList());
    }
    public List<CourseModel> getAllCoursesByEmployerId(Long courseCreatorId) {
        // Fetch courses created by the given employer and approved
        List<CourseDTO> courses = courseRepository.findByIsApprovedTrueAndEmployeeDTO_Sr(courseCreatorId);

        // Log the number of courses found
        System.out.println("Number of courses found: " + courses.size());

        return courses.stream().map(course -> {
            // Fetch upload files for each course
            List<UploadFilesDTO> uploadFiles = uploadFilesRepository.findAllByCourseId(course.getId());
            System.out.println("Upload file size for course ID " + course.getId() + ": " + uploadFiles.size());

            // Map CourseDTO to CourseModel
            CourseModel courseModel = modelMapper.map(course, CourseModel.class);

            // Map UploadFilesDTO to UploadFilesModel
            List<UploadFilesModel> uploadFilesModels = uploadFiles.stream()
                    .map(file -> modelMapper.map(file, UploadFilesModel.class))
                    .collect(Collectors.toList());

            // Set upload files in the course model
            courseModel.setUploadFiles(uploadFilesModels);

            // Log the course model details
            System.out.println("CourseModel: " + courseModel);

            return courseModel;
        }).collect(Collectors.toList());
    }
    public List<CourseModel> getAllUnApprovedCoursesByEmployerId(Long courseCreatorId) {
        // Fetch courses created by the given employer and approved
        List<CourseDTO> courses = courseRepository.findByIsApprovedFalseAndEmployeeDTO_Sr(courseCreatorId);

        // Log the number of courses found
        System.out.println("Number of courses found: " + courses.size());

        return courses.stream().map(course -> {
            boolean exists = examRepository.existsByCourseId(course.getId());
            // Fetch upload files for each course
            List<UploadFilesDTO> uploadFiles = uploadFilesRepository.findAllByCourseId(course.getId());
            System.out.println("Upload file size for course ID " + course.getId() + ": " + uploadFiles.size());

            // Map CourseDTO to CourseModel
            CourseModel courseModel = modelMapper.map(course, CourseModel.class);
            courseModel.setHasExam(exists);

            // Map UploadFilesDTO to UploadFilesModel
            List<UploadFilesModel> uploadFilesModels = uploadFiles.stream()
                    .map(file -> modelMapper.map(file, UploadFilesModel.class))
                    .collect(Collectors.toList());

            // Set upload files in the course model
            courseModel.setUploadFiles(uploadFilesModels);

            // Log the course model details
            System.out.println("CourseModel: " + courseModel);

            return courseModel;
        }).collect(Collectors.toList());
    }

}
