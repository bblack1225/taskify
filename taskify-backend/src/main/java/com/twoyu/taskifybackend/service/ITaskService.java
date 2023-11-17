package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskDescRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.DeleteTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskDescResponse;
import com.twoyu.taskifybackend.model.vo.response.shared.TasksResponse;

import java.util.UUID;

public interface ITaskService {
    TasksResponse addTask(AddTaskRequest request);

    TasksResponse updateTask(UUID id, UpdateTaskRequest request);

    DeleteTaskResponse deleteTask(UUID id);

    UpdateTaskDescResponse updateDesc(UUID id, UpdateTaskDescRequest description);
}
