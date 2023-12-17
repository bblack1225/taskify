package com.twoyu.taskifybackend.model.vo.response;

import java.util.UUID;

public record UserInfoResponse(UUID id, String name, String email, UUID boardId, String boardName) {

}
