package com.twoyu.taskifybackend.exception;


import lombok.Data;

@Data
public class ErrorResponse {
    private String errorMessage;
    private int errorCode;
}
