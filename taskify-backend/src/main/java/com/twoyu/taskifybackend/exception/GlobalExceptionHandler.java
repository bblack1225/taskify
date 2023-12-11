package com.twoyu.taskifybackend.exception;

import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = ServiceException.class)
    public ResponseEntity<ErrorResponse> handleServiceException(ServiceException se){
        log.error("ServiceException Error: ", se);
        ErrorResponse errorResponse = new ErrorResponse();
        HttpStatus errorStatus = HttpStatus.BAD_REQUEST;
        errorResponse.setErrorMessage(se.getMessage());
        errorResponse.setErrorCode(errorStatus.value());
        return new ResponseEntity<>(errorResponse, errorStatus);
    }

    @ExceptionHandler(value = AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ae){
        log.error("AuthenticationException Error: ", ae);
        ErrorResponse errorResponse = new ErrorResponse();
        HttpStatus errorStatus = HttpStatus.UNAUTHORIZED;
        errorResponse.setErrorMessage(ae.getMessage());
        errorResponse.setErrorCode(errorStatus.value());
        return new ResponseEntity<>(errorResponse, errorStatus);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e){
        log.error("Exception Error: ", e);
        ErrorResponse errorResponse = new ErrorResponse();
        HttpStatus errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        errorResponse.setErrorMessage(e.getMessage());
        errorResponse.setErrorCode(errorStatus.value());
        return new ResponseEntity<>(errorResponse, errorStatus);
    }
}
