package com.E_Learnig.System.Configuration;
import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;
@Configuration
public class CloudConfiguration {
    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> valuesMap = new HashMap<>();
//        MPT's API KEY
     valuesMap.put("cloud_name", "dsc9cgrzu");
       valuesMap.put("api_key", "627985882244477");
        valuesMap.put("api_secret", "Z7PLKIiMVEhT9lc2GhbxDMvfzmI");

//Ko Nyein's API Key
//        valuesMap.put("cloud_name", "duh1rvznn");
//        valuesMap.put("api_key", "642252897153534");
//        valuesMap.put("api_secret", "oEw5DLoW_oVwUCBuoZQ3WKR1FCQ");

        return new Cloudinary(valuesMap);
    }
}
