package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.CheckEmailExistRequest;
import com.twoyu.taskifybackend.model.vo.request.LoginRequest;
import com.twoyu.taskifybackend.model.vo.request.RegisterRequest;
import com.twoyu.taskifybackend.model.vo.response.CheckEmailExistResponse;
import com.twoyu.taskifybackend.model.vo.response.LoginResponse;
import com.twoyu.taskifybackend.model.vo.response.RegisterResponse;
import com.twoyu.taskifybackend.service.impl.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest request){
        return authService.login(request);
    }

    @PostMapping("/check-email")
    public CheckEmailExistResponse checkEmailExist(@RequestBody @Valid CheckEmailExistRequest request){
        return authService.checkEmailExist(request);
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody @Valid RegisterRequest request){
        return authService.register(request);
    }

}
