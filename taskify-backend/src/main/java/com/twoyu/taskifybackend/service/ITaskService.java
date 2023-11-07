package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.AddTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.DeleteTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskResponse;

import java.util.UUID;

public interface ITaskService {
    AddTaskResponse addTask(AddTaskRequest request);

    UpdateTaskResponse updateTask(UUID id, UpdateTaskRequest request);

    DeleteTaskResponse deleteTask(UUID id);
}
