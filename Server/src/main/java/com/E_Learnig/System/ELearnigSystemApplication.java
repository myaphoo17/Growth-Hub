package com.E_Learnig.System;

import com.E_Learnig.System.Configuration.StorageProperties;
import com.E_Learnig.System.service.StorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class ELearnigSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ELearnigSystemApplication.class, args);
	}

	@Bean
	CommandLineRunner init(StorageService storageService){
		return args -> {
			storageService.init();
		};
	}
}
