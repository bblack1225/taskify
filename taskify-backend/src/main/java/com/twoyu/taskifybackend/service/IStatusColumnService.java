package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;

public interface IStatusColumnService {
 AddColumnResponse addColumn(AddColumnRequest addColumnRequest);
}
