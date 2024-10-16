package com.E_Learnig.System.Controller;

import com.E_Learnig.System.DAO.Service.CategoriesService;
import com.E_Learnig.System.DTO.CategoriesDTO;
import com.E_Learnig.System.Model.CategoriesModel;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoriesController {

    @Autowired
    private CategoriesService categoriesService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/getAllCategories")
    public ResponseEntity<List<CategoriesDTO>> getAllCategories() {
        List<CategoriesModel> categories = categoriesService.getAllCategories();
        List<CategoriesDTO> categoriesDTOs = categories.stream()
                .map(category -> modelMapper.map(category, CategoriesDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoriesDTOs);
    }
}
