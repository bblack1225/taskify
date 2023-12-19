package com.twoyu.taskifybackend.model.vo.response;

import com.twoyu.taskifybackend.model.vo.response.shared.StatusColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.shared.TasksResponse;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class QueryBaseDataResponse {
    private UUID boardId;
    private String boardName;
    private List<StatusColumnResponse> columns;
    private List<TasksResponse> tasks;

}
