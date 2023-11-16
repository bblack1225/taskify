package com.twoyu.taskifybackend.model.vo.request.shared;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class TaskLabelReq {
    @NotNull
    private UUID id;
    @NotBlank
    private String name;
    @NotBlank
    private String color;
}
