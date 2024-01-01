package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.model.entity.Users;
import com.twoyu.taskifybackend.model.vo.request.CheckEmailExistRequest;
import com.twoyu.taskifybackend.model.vo.request.LoginRequest;
import com.twoyu.taskifybackend.model.vo.request.RegisterRequest;
import com.twoyu.taskifybackend.model.vo.response.CheckEmailExistResponse;
import com.twoyu.taskifybackend.model.vo.response.LoginResponse;
import com.twoyu.taskifybackend.auth.JwtUtil;
import com.twoyu.taskifybackend.model.vo.response.RegisterResponse;
import com.twoyu.taskifybackend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsersRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request){
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword());
        Authentication authentication = authenticationManager.authenticate(authToken);
        String email = authentication.getName();
        String token = jwtUtil.createToken(email);
        return  LoginResponse.builder()
                .email(email)
                .token(token)
                .build();
    }

    public CheckEmailExistResponse checkEmailExist(CheckEmailExistRequest request){
        boolean isEmailExist = userRepository.existsByEmail(request.getEmail());
        return new CheckEmailExistResponse(isEmailExist);
    }

    public RegisterResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            return new RegisterResponse(request.getEmail(), false, "EMAIL_EXIST");
        }
        Users user = new Users();
        user.setName(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return new RegisterResponse(request.getEmail(), true, "REGISTER_SUCCESS");
    }
}
