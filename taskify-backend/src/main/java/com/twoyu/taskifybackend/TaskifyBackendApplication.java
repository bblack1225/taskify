package com.twoyu.taskifybackend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.SecureRandom;
import java.util.Base64;

@SpringBootApplication
public class TaskifyBackendApplication {


    public static void main(String[] args) {
        SpringApplication.run(TaskifyBackendApplication.class, args);
    }

}
