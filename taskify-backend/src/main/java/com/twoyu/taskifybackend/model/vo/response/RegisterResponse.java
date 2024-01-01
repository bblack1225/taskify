package com.twoyu.taskifybackend.model.vo.response;

public record RegisterResponse(String email, boolean isSuccess, String message) {
}
