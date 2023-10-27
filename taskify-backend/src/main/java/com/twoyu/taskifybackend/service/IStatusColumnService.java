package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnTitleRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.DeleteColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryAllColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateColumnTitleResponse;

import java.util.UUID;

public interface IStatusColumnService {
 AddColumnResponse addColumn(AddColumnRequest addColumnRequest);
 QueryAllColumnResponse queryAll(UUID boardId);

 UpdateColumnTitleResponse updateTitle(UUID id, UpdateColumnTitleRequest request);

 DeleteColumnResponse delete(UUID id);
}
