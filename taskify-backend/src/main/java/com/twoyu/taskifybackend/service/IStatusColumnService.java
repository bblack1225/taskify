package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnTitleRequest;
import com.twoyu.taskifybackend.model.vo.response.*;

import java.util.UUID;

public interface IStatusColumnService {
 AddColumnResponse addColumn(AddColumnRequest addColumnRequest);
 UpdateColumnTitleResponse updateTitle(UUID id, UpdateColumnTitleRequest request);

 DeleteColumnResponse delete(UUID id);

 QueryBaseDataResponse queryBaseData(UUID boardId);
}
