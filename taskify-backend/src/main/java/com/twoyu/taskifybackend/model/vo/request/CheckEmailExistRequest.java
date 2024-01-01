package com.twoyu.taskifybackend.model.vo.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckEmailExistRequest {
    @NotBlank
    private String email;
}
