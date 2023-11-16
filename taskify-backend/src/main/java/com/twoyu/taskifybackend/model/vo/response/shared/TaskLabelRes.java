package com.twoyu.taskifybackend.model.vo.response.shared;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TaskLabelRes {
    private UUID id;
    private String name;
    private String color;
}
