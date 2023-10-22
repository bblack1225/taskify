package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnRes;

public interface IStatusColumnService {
 AddColumnRes addColumn(AddColumnRequest addColumnRequest);
}
