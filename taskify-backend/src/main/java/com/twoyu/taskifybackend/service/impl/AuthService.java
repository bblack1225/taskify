package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.model.vo.request.LoginRequest;
import com.twoyu.taskifybackend.model.vo.response.LoginResponse;
import com.twoyu.taskifybackend.auth.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

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
}
