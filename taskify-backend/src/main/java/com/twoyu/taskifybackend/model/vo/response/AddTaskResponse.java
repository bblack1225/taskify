package com.twoyu.taskifybackend.model.vo.response;

import java.util.UUID;

public record AddTaskResponse(UUID id, String name, String description, int dataIndex, UUID statusColumnId) {
}
