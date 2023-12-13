package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.AddTaskLabelsRequest;
import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskDescRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.DeleteTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskDescResponse;
import com.twoyu.taskifybackend.model.vo.response.shared.TasksResponse;
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
    public TasksResponse addTask(@RequestBody @Valid AddTaskRequest request){
        return taskService.addTask(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改任務(點進任務modal後的操作)")
    public TasksResponse updateTask(@PathVariable UUID id, @RequestBody @Valid UpdateTaskRequest request){
        return taskService.updateTask(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "刪除一個任務")
    public DeleteTaskResponse deleteTask(@PathVariable UUID id){
        return taskService.deleteTask(id);
    }

    @Operation(summary = "修改任務描述")
    @PutMapping("/{id}/desc")
    public UpdateTaskDescResponse updateTaskDescription(@PathVariable UUID id, @RequestBody @Valid UpdateTaskDescRequest request){
        return taskService.updateDesc(id, request);
    }

    @PostMapping("/{id}/labels")
    @Operation(summary = "新增任務的標籤")
    public void addTaskLabel(@PathVariable UUID id, @RequestBody @Valid AddTaskLabelsRequest request){
        taskService.addTaskLabel(id, request);
    }

    @DeleteMapping("/{id}/labels/{labelId}")
    @Operation(summary = "刪除任務的標籤")
    public void deleteTaskLabel(@PathVariable UUID id, @PathVariable UUID labelId){
        taskService.deleteTaskLabel(id, labelId);
    }
}
