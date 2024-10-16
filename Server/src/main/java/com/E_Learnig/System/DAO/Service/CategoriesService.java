package com.E_Learnig.System.DAO.Service;

import com.E_Learnig.System.DAO.Repository.CategoriesRepository;
import com.E_Learnig.System.DTO.CategoriesDTO;
import com.E_Learnig.System.Model.CategoriesModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriesService {

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<CategoriesModel> getAllCategories() {
        List<CategoriesDTO> categories = categoriesRepository.findAll();
        return categories.stream()
                .map(category -> modelMapper.map(category, CategoriesModel.class))
                .collect(Collectors.toList());
    }
}
