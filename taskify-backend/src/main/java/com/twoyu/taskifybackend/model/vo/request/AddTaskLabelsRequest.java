package com.twoyu.taskifybackend.model.vo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AddTaskLabelsRequest {
    @NotNull
    private UUID labelId;
}
