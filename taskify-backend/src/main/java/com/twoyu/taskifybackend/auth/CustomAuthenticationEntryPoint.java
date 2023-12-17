package com.twoyu.taskifybackend.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twoyu.taskifybackend.exception.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;


@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        PrintWriter writer = response.getWriter();
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setErrorMessage("Invalid Token");
        errorResponse.setErrorCode(401);
        ObjectMapper objectMapper = new ObjectMapper();
        writer.write(objectMapper.writeValueAsString(errorResponse));
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        writer.flush();
        writer.close();
    }
}
