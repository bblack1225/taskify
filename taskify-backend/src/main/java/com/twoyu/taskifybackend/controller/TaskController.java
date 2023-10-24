package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.AddTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskResponse;
import com.twoyu.taskifybackend.service.ITaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final ITaskService taskService;

    @PostMapping
    public AddTaskResponse addTask(@RequestBody @Valid AddTaskRequest request){
        return taskService.addTask(request);
    }

    @PutMapping
    public UpdateTaskResponse updateTask(@RequestBody @Valid UpdateTaskRequest request){
        return taskService.updateTask(request);
    }
}
