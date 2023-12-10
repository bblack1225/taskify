package com.twoyu.taskifybackend.model.vo.response.shared;

import com.twoyu.taskifybackend.model.entity.Tasks;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private UUID columnId;
    private LocalDateTime startDate;
    private LocalDateTime dueDate;


    public static TasksResponse from(Tasks task, List<UUID> labelIds){
        return TasksResponse.builder()
                .id(task.getId())
                .name(task.getName())
                .dataIndex(task.getDataIndex())
                .description(task.getDescription())
                .labels(labelIds)
                .columnId(task.getStatusId())
                .build();
    }
}
