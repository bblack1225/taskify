package com.twoyu.taskifybackend.model.vo.response;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String username;
    private String email;
}
