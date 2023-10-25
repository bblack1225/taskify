package com.twoyu.taskifybackend.model.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.twoyu.taskifybackend.model.vo.response.shared.LabelsResponse;
import com.twoyu.taskifybackend.model.vo.response.shared.TaskColumnRes;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class QueryAllColumnResponse {
    private UUID boardId;
    private String boardName;

    @JsonProperty("columns")
    private List<TaskColumnRes> columns;

    @JsonProperty("labels")
    private List<LabelsResponse> labels;

}
