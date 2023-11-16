package com.twoyu.taskifybackend.model.dto;

import com.twoyu.taskifybackend.repository.projection.TaskLabelsProjection;
import lombok.Data;

import java.util.UUID;

@Data
public class TasksDto {
    private UUID taskId;
    private String taskName;
    private Integer dataIndex;
    private String description;
    private UUID columnId;

    public static TasksDto fromProjection(TaskLabelsProjection projection) {
        TasksDto dto = new TasksDto();
        dto.setTaskId(projection.getTaskId());
        dto.setTaskName(projection.getTaskName());
        dto.setDataIndex(projection.getDataIndex());
        dto.setDescription(projection.getDescription());
        dto.setColumnId(projection.getColumnId());
        return dto;
    }
}
