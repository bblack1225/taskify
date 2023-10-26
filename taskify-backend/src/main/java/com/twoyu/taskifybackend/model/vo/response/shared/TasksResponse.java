package com.twoyu.taskifybackend.model.vo.response.shared;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TasksResponse {
    @Schema(description = "任務ID")
    private UUID id;
    @Schema(description = "任務名稱")
    private String name;
    @Schema(description = "任務在列表中的排序")
    private Integer dataIndex;
    @Schema(description = "任務描述")
    private String description;
    @Schema(description = "任務包含的標籤")
    private List<UUID> labels;
}
