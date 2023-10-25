package com.twoyu.taskifybackend.model.vo.response.shared;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TasksResponse {
    private UUID id;
    private String name;
    private Integer dataIndex;
    private String description;
    private List<UUID> labels;
}
