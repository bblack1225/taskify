package com.twoyu.taskifybackend.model.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UpdateTaskRequest {

    @Size(max = 50)
    @Schema(description = "任務名稱")
    private String name;

    @Schema(description = "任務開始時間")
    private String startDate;

    @Schema(description = "任務截止時間")
    private String dueDate;

}
