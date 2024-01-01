package com.twoyu.taskifybackend.model.vo.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Size(max = 32)
    private String email;

    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Size(max = 32)
    private String password;
}
