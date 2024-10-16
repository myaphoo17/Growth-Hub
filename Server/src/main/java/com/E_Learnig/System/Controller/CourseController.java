package com.E_Learnig.System.Controller;


import com.E_Learnig.System.DAO.Service.CourseService;
import com.E_Learnig.System.DTO.CategoriesDTO;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.Model.CategoriesModel;
import com.E_Learnig.System.Model.CourseModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/getAllCourses")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseModel> courses = courseService.getAllCourses();
        List<CourseDTO> courseDTOs = courses.stream()
                .map(course -> modelMapper.map(course, CourseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseDTOs);
    }



    @GetMapping("/search")
    public ResponseEntity<List<CourseModel>> searchCourses(@RequestParam("title") String title) {
        List<CourseDTO> courses = courseService.searchCoursesByTitle(title);
        List<CourseModel> courseModels = courses.stream()
                .filter(course -> course.isApproved()) // Ensure only approved courses are returned
                .map(course -> modelMapper.map(course, CourseModel.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(courseModels);
    }

//    @GetMapping("/categories")
//    public ResponseEntity<List<CategoriesModel>> getAllCategories() {
//        List<CategoriesDTO> categoriesDTOs = courseService.findAll();
//        List<CategoriesModel> categoriesModels = categoriesDTOs.stream()
//                .map(dto -> modelMapper.map(dto, CategoriesModel.class))
//                .collect(Collectors.toList());
//        return new ResponseEntity<>(categoriesModels, HttpStatus.OK);
//    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoriesModel>> getAllCategories() {
        List<CategoriesModel> categories = courseService.getAllCategoriesWithApprovedCourses();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

}
