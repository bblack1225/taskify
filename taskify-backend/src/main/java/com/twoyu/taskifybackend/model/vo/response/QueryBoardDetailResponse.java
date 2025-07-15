package com.twoyu.taskifybackend.model.vo.response;

import java.util.UUID;

public record QueryBoardDetailResponse(
        UUID id,
        String name,
        String description,
        String icon,
        String themeColor,
        String createdAt,
        String modifiedAt,
        String pinnedAt) {
}
