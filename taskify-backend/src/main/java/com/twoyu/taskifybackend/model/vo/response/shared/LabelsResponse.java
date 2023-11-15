package com.twoyu.taskifybackend.model.vo.response.shared;

import com.twoyu.taskifybackend.model.entity.Labels;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class LabelsResponse {
    private UUID id;
    private String name;
    private String color;
    private UUID boardId;

    public static List<LabelsResponse> from(List<Labels> labels) {
        return labels.stream().map(label -> LabelsResponse.builder()
                .id(label.getId())
                .name(label.getName())
                .color(label.getColor())
                .boardId(label.getBoardId())
                .build()).toList();
    }
}
