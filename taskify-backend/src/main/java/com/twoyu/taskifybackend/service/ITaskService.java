package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.AddTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskResponse;

public interface ITaskService {
    AddTaskResponse addTask(AddTaskRequest request);

    UpdateTaskResponse updateTask(UpdateTaskRequest request);
}
