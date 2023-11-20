package com.twoyu.taskifybackend.model.vo.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LabelMutateRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String color;
}
