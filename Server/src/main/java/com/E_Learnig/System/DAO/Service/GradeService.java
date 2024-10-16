package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.CourseRepository;
import com.E_Learnig.System.DAO.Repository.ExamRepository;
import com.E_Learnig.System.DAO.Repository.GradeRepository;
import com.E_Learnig.System.DTO.CourseDTO;
import com.E_Learnig.System.DTO.ExamDTO;
import com.E_Learnig.System.DTO.GradeDTO;
import com.E_Learnig.System.Exception.ResourceNotFoundException;
import com.E_Learnig.System.Model.ExamModel;
import com.E_Learnig.System.Model.GradeModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private CourseRepository courseRepository;

    public void saveGrades(List<GradeModel> gradeModels) {
        for (GradeModel gradeModel : gradeModels) {
            GradeDTO gradeDTO = new GradeDTO();
            gradeDTO.setName(gradeModel.getName());
            gradeDTO.setMinPoints(gradeModel.getMinPoints());
            gradeDTO.setMaxPoints(gradeModel.getMaxPoints());
            gradeDTO.setTotalPoints(gradeModel.getTotalPoints());

            CourseDTO courseDTO = courseRepository.findById(gradeModel.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + gradeModel.getCourseId()));

            gradeDTO.setCourse(courseDTO);

            gradeRepository.save(gradeDTO);
        }
    }

    public List<GradeModel> getGradesByCourseId(long courseId) {
        List<GradeDTO> gradeDTOS = gradeRepository.findByCourse_Id(courseId);
        return gradeDTOS.stream()
                .map(this::convertToModel)
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveAndUpdateGrades(long courseId, List<GradeModel> gradeModels) {
        // Fetch existing grades for the given courseId
        List<GradeDTO> existingGrades = gradeRepository.findByCourse_Id(courseId);

        // Update existing grades or add new ones
        for (GradeModel gradeModel : gradeModels) {
            if (gradeModel.getId() != null && gradeModel.getId() != 0) {
                // Update existing grade
                Optional<GradeDTO> existingGradeOptional = existingGrades.stream()
                        .filter(g -> g.getId().equals(gradeModel.getId()))
                        .findFirst();

                if (existingGradeOptional.isPresent()) {
                    GradeDTO existingGrade = existingGradeOptional.get();
                    existingGrade.setName(gradeModel.getName());
                    existingGrade.setMinPoints(gradeModel.getMinPoints());
                    existingGrade.setMaxPoints(gradeModel.getMaxPoints());
                    gradeRepository.save(existingGrade);
                } else {
                    throw new RuntimeException("Grade not found for id: " + gradeModel.getId());
                }
            } else {
                // Add new grade
                GradeDTO newGrade = new GradeDTO();
                newGrade.setName(gradeModel.getName());
                newGrade.setMinPoints(gradeModel.getMinPoints());
                newGrade.setMaxPoints(gradeModel.getMaxPoints());

                CourseDTO courseDTO = courseRepository.findById(courseId)
                        .orElseThrow(() -> new RuntimeException("Course not found"));

                newGrade.setCourse(courseDTO);
                gradeRepository.save(newGrade);
            }
        }

        // Remove grades that are not in the input list
        List<Long> gradeIds = gradeModels.stream()
                .map(GradeModel::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        for (GradeDTO existingGrade : existingGrades) {
            if (!gradeIds.contains(existingGrade.getId())) {
                gradeRepository.deleteById(existingGrade.getId());
            }
        }
    }


    private GradeModel convertToModel(GradeDTO gradeDTO) {
        GradeModel gradeModel = new GradeModel();
        gradeModel.setName(gradeDTO.getName());
        gradeModel.setMinPoints(gradeDTO.getMinPoints());
        gradeModel.setMaxPoints(gradeDTO.getMaxPoints());
        // You can map other properties as needed
        return gradeModel;
    }
}
