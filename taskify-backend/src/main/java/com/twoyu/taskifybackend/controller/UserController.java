package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.response.UserInfoResponse;
import com.twoyu.taskifybackend.repository.UsersRepository;
import com.twoyu.taskifybackend.service.IUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "使用者功能", description = "使用者相關的API")
public class UserController {

    private final IUserService userService;

    @GetMapping("/info")
    public UserInfoResponse getUserInfo(){
        return userService.getUserInfo();
    }


//    @PostMapping("/add")
//    public void addUser(){
//        Users user = new Users();
//        user.setName("keely1112");
//        user.setEmail("helennnnn1@gmail.com");
//        user.setPassword("8686");
//        usersRepository.save(user);
//    }
}
