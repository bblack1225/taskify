package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryAllColumnResponse;

import java.util.UUID;

public interface IStatusColumnService {
 AddColumnResponse addColumn(AddColumnRequest addColumnRequest);
 QueryAllColumnResponse queryAll(UUID boardId);
}
