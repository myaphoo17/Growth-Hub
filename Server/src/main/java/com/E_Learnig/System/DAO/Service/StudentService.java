package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.*;
import com.E_Learnig.System.DTO.*;
import com.E_Learnig.System.DTO.enm.NotificationType;
import com.E_Learnig.System.Model.CourseModel;
import com.E_Learnig.System.Model.UploadFilesModel;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {
    @Autowired
    private EmployeeRepository employerRepository;
    @Autowired
    private EducationRepository educationRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UploadFilesRepository uploadFilesRepository;

    @Autowired
    private NotificationRepository notificationRepository;


    public EmployeeDTO updateStudentProfile(String staffId, EmployeeDTO employerDTODetails) {
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
    public CourseModel getCourseById(Long id) {
        Optional<CourseDTO> optionalCourse = courseRepository.findById(id);

        if (optionalCourse.isPresent()) {
            CourseDTO course = optionalCourse.get();
            List<UploadFilesDTO> uploadFiles = uploadFilesRepository.findAllByCourseId(course.getId());
            CourseModel courseModel = modelMapper.map(course, CourseModel.class);
            List<UploadFilesModel> uploadFilesModels = uploadFiles.stream()
                    .map(file -> modelMapper.map(file, UploadFilesModel.class))
                    .collect(Collectors.toList());

            courseModel.setUploadFiles(uploadFilesModels);
            return courseModel;
        } else {
            // Handle the case when the course is not found (e.g., throw an exception or return null)
            throw new EntityNotFoundException("Course with id " + id + " not found");
        }
    }

    public void sendEnrollCourseNotificationToInstructor(String userFromStaffId, CourseDTO courseDTO) {
        // Fetch the sender and recipient
        EmployeeDTO sender = employerRepository.findByStaffId(userFromStaffId);
        EmployeeDTO recipient = employerRepository.findByStaffId(courseDTO.getEmployeeDTO().getStaffId());
        // Check if both sender and recipient are found and are different
        if (sender != null && recipient != null && !Objects.equals(sender.getSr(), recipient.getSr())) {

            // Create a new notification
            Notification notification = new Notification();
            notification.setUserFrom(sender);
            notification.setIdPost(courseDTO.getId()); // Assuming no specific post ID for this notification
            notification.setIsRead(false);
            notification.setRecipient(recipient);
            notification.setMessage(String.format("%s enrolled you in the %s course.", sender.getName(), courseDTO.getTitle()));
            notification.setNotificationType(NotificationType.ENROLL);
            notification.setEmailFrom(sender.getEmail());

            // Save the new notification
            notificationRepository.save(notification);
            System.out.println("noti save success fully");
        }
    }
}
