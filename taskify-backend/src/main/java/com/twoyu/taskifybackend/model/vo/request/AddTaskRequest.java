package com.twoyu.taskifybackend.model.vo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AddTaskRequest {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private Integer dataIndex;
    @NotBlank
    private UUID statusColumnId;

}
