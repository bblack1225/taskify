package com.twoyu.taskifybackend.model.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class AddTaskRequest {
    @NotBlank
    @Schema(description = "任務名稱", example = "任務A")
    @Size(max = 50)
    private String name;
    @NotNull
    @Schema(description = "任務在看板中的排序", example = "0")
    private Integer dataIndex;

    @NotNull
    @Schema(description = "任務所屬的看板ID")
    private UUID statusColumnId;

}
