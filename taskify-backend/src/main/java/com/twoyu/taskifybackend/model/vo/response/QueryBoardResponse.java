package com.twoyu.taskifybackend.model.vo.response;

import java.util.UUID;

public record QueryBoardResponse(UUID id, String name, String description){
}
