package com.twoyu.taskifybackend.model.vo.response;

import java.util.UUID;

public record UpdateColumnTitleResponse(UUID id, UUID boardId, String title, int dataIndex) {
}
