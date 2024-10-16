package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.CategoriesRepository;
import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.UploadFilesRepository;
import com.E_Learnig.System.DTO.CategoriesDTO;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.EmployeeDTO;
import com.E_Learnig.System.DTO.UploadFilesDTO;
import com.E_Learnig.System.Model.CategoriesModel;
import com.E_Learnig.System.Model.CourseModel;
import com.E_Learnig.System.Model.UploadFilesModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UploadFilesRepository uploadFilesRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    CategoriesRepository categoriesRepository;

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

    public List<CourseModel> searchCourses(String query) {
        List<CourseDTO> courses = courseRepository.findByTitleContainingIgnoreCaseAndIsApprovedTrue(query);
        return courses.stream().map(course -> {
            List<UploadFilesDTO> uploadFiles = uploadFilesRepository.findAllByCourseId(course.getId());
            CourseModel courseModel = modelMapper.map(course, CourseModel.class);
            List<UploadFilesModel> uploadFilesModels = uploadFiles.stream()
                    .map(file -> modelMapper.map(file, UploadFilesModel.class))
                    .collect(Collectors.toList());
            courseModel.setUploadFiles(uploadFilesModels);
            return courseModel;
        }).collect(Collectors.toList());
    }
    public EmployeeDTO getEmployeeByCourseId(Long courseId) {
        CourseDTO courseDTO = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return courseDTO.getEmployeeDTO();
    }

    public List<CourseDTO> searchCoursesByTitle(String title) {
        return courseRepository.searchApprovedCoursesByTitle(title);
    }

    public List<CategoriesDTO> findAll() {
        return categoriesRepository.findAll();
    }

    public List<CategoriesModel> getAllCategoriesWithApprovedCourses() {
        List<CategoriesDTO> categoriesDTOs = categoriesRepository.findAllCategoriesWithApprovedCourses();
        return categoriesDTOs.stream()
                .map(category -> {
                    CategoriesModel categoriesModel = modelMapper.map(category, CategoriesModel.class);
                    categoriesModel.setCourseDTO(category.getCourseDTO().stream()
                            .filter(CourseDTO::isApproved)
                            .collect(Collectors.toList()));
                    return categoriesModel;
                })
                .collect(Collectors.toList());
    }

    public Long getEnrollmentCount(Long courseId) {
        return courseRepository.countEnrollmentsByCourseId(courseId);
    }
    public Long getEnrollmentCountNodupli(Long courseId) {
        return courseRepository.countUniqueCoursesByStaffId(courseId);
    }
}
