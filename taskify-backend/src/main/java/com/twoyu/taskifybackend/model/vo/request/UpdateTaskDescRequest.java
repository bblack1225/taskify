package com.twoyu.taskifybackend.model.vo.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateTaskDescRequest {
    @NotBlank
    private String description;
}
