package com.twoyu.taskifybackend.model.vo.response;

import lombok.Data;

import java.util.UUID;

@Data
public class AddColumnResponseOld {
    private UUID id;
    private UUID boardId;
    private String title;
    private int order;
}
