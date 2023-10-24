package com.twoyu.taskifybackend.model.vo.response;

import java.util.List;
import java.util.UUID;

public record UpdateTaskResponse(UUID id, String name, String description, int dataIndex, UUID statusColumnId, List<UUID> labels) {
}
