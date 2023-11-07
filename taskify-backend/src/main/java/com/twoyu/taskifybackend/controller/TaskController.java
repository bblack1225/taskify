package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.AddTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskResponse;
import com.twoyu.taskifybackend.service.ITaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "任務功能", description = "任務相關的API")
public class TaskController {

    private final ITaskService taskService;

    @PostMapping
    @Operation(summary = "新增一個任務")
    public AddTaskResponse addTask(@RequestBody @Valid AddTaskRequest request){
        return taskService.addTask(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改任務(點進任務modal後的操作)")
    public UpdateTaskResponse updateTask(@PathVariable UUID id, @RequestBody @Valid UpdateTaskRequest request){
        return taskService.updateTask(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "刪除一個任務")
    public void deleteTask(@PathVariable UUID id){
        taskService.deleteTask(id);
    }

}
