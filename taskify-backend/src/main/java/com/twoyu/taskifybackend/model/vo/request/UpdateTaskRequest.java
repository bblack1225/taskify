package com.twoyu.taskifybackend.model.vo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UpdateTaskRequest {
    @NotBlank
    private UUID id;
    @NotBlank
    @Size(max = 50)
    private String name;
    private String description;
    private List<UUID> labels;
    private UUID boardId;
}
