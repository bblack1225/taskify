package com.twoyu.taskifybackend.model.vo.response.shared;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.twoyu.taskifybackend.model.entity.Labels;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class TaskColumnRes {
    @Schema(description = "列表ID")
    private UUID id;
    @Schema(description = "列表標題")
    private String title;
    @Schema(description = "列表顏色")
    private String color;
    @Schema(description = "列表排序")
    private Integer dataIndex;

    @JsonProperty("tasks")
    @Schema(description = "列表中的任務卡片")
    private List<TasksResponse> tasks;
}
