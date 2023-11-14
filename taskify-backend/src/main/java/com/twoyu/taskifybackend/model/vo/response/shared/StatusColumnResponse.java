package com.twoyu.taskifybackend.model.vo.response.shared;

import lombok.Data;

import java.util.UUID;

@Data
public class StatusColumnResponse {
    private UUID id;
    private String title;
    private String color;
    private Integer dataIndex;
}
