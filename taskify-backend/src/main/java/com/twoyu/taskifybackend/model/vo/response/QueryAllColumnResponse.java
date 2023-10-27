package com.twoyu.taskifybackend.model.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.twoyu.taskifybackend.model.vo.response.shared.LabelsResponse;
import com.twoyu.taskifybackend.model.vo.response.shared.TaskColumnRes;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class QueryAllColumnResponse {
    @Schema(description = "看板ID")
    private UUID boardId;
    @Schema(description = "看板名稱")
    private String boardName;

    @JsonProperty("columns")
    @Schema(description = "狀態列表")
    private List<TaskColumnRes> columns;

//    @JsonProperty("labels")
//    @Schema(description = "看板的標籤列表")
//    private List<LabelsResponse> labels;

}
