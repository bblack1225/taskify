package com.twoyu.taskifybackend.model.vo.response;

import java.util.UUID;

public record AddColumnRes(UUID id, UUID boardId, String title, int order){
}
