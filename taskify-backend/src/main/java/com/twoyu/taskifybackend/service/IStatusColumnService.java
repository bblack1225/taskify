package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnRequest;
import com.twoyu.taskifybackend.model.vo.response.*;

import java.util.UUID;

public interface IStatusColumnService {
 AddColumnResponse addColumn(AddColumnRequest addColumnRequest);
 UpdateColumnResponse updateTitle(UUID id, UpdateColumnRequest request);

 DeleteColumnResponse delete(UUID id);

 QueryBaseDataResponse queryBaseData(UUID boardId);
}
