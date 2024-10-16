package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.UploadFilesRepository;
import com.E_Learnig.System.DTO.UploadFilesDTO;
import com.E_Learnig.System.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UploadFilesService {

    @Autowired
    private UploadFilesRepository uploadFilesRepository;

    public UploadFilesDTO markAsCompleted(long id, boolean completed) {
        UploadFilesDTO file = uploadFilesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id " + id));

        file.setCompleted(completed);
        return uploadFilesRepository.save(file);
    }

    public List<UploadFilesDTO> getVideosByCourseId(Long courseId) {
        return uploadFilesRepository.findAllByCourseId(courseId);
    }
}
