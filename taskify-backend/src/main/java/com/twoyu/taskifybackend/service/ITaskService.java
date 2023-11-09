package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskDescRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.DeleteTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.MutateTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskDescResponse;

import java.util.UUID;

public interface ITaskService {
    MutateTaskResponse addTask(AddTaskRequest request);

    MutateTaskResponse updateTask(UUID id, UpdateTaskRequest request);

    DeleteTaskResponse deleteTask(UUID id);

    UpdateTaskDescResponse updateDesc(UUID id, UpdateTaskDescRequest description);
}
