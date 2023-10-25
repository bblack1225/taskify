package com.twoyu.taskifybackend.model.vo.response.shared;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.twoyu.taskifybackend.model.entity.Labels;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class TaskColumnRes {
    private UUID id;
    private String title;
    private String color;
    private Integer dataIndex;

    @JsonProperty("cards")
    private List<TasksResponse> cards;
}
