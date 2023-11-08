package com.twoyu.taskifybackend.model.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UpdateTaskRequest {
    @NotBlank
    @Size(max = 50)
    @Schema(description = "任務名稱")
    private String name;
    @Schema(description = "任務含有的標籤")
    private List<UUID> labels;
    @Schema(description = "所屬的看板ID")
    private UUID boardId;
}
