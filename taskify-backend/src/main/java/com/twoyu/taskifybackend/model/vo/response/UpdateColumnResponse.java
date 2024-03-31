package com.twoyu.taskifybackend.model.vo.response;

import java.util.Map;
import java.util.UUID;

public record UpdateColumnResponse(UUID id, UUID boardId, String title, Double dataIndex, Map<UUID, Double> columnIndexMap) {
    public UpdateColumnResponse(UUID id, UUID boardId, String title, Double dataIndex) {
        this(id, boardId, title, dataIndex, null);
    }
}
