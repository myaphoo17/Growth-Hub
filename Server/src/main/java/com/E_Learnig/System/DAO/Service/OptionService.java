package com.E_Learnig.System.DAO.Service;


import com.E_Learnig.System.DAO.Repository.OptionRepository;
import com.E_Learnig.System.DTO.OptionDTO;
import com.E_Learnig.System.Model.OptionModel;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OptionService {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    OptionRepository optionRepo;

    public long addOption(OptionModel optionModel){
        OptionDTO optionDTO = modelMapper.map(optionModel, OptionDTO.class);
        optionRepo.save(optionDTO);
        return 1;
    }

}
