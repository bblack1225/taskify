package com.twoyu.taskifybackend.model.vo.response;

import java.util.UUID;

public record UpdateColumnResponse(UUID id, UUID boardId, String title, Double dataIndex) {
}
