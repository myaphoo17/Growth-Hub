package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.EducationRepository;
import com.E_Learnig.System.DTO.EducationDTO;

import com.E_Learnig.System.Model.EducationModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

@Service
public class EducationService {
    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ModelMapper modelMapper;

    public EducationModel getEducationsById(Long id) {
        EducationDTO education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceAccessException("Education not found with id " + id));
        return modelMapper.map(education, EducationModel.class);
    }

    public EducationDTO updateEducation(Long id, EducationDTO educationDTO) {
        EducationDTO existingEducation = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceAccessException("Education not found with id " + id));
        modelMapper.map(educationDTO, existingEducation);
        return modelMapper.map(educationRepository.save(existingEducation), EducationDTO.class);
    }

    public boolean deleteEducation(Long educationId) {
        educationRepository.deleteById(educationId);
        return true;
    }
}
