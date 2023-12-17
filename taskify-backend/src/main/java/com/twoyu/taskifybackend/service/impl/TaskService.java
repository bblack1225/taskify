package com.twoyu.taskifybackend.service.impl;


import com.twoyu.taskifybackend.exception.TaskNotFoundException;
import com.twoyu.taskifybackend.model.entity.*;
import com.twoyu.taskifybackend.model.vo.request.AddTaskLabelsRequest;
import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskDescRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.DeleteTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskDescResponse;
import com.twoyu.taskifybackend.model.vo.response.shared.TasksResponse;
import com.twoyu.taskifybackend.repository.TasksLabelsRepository;
import com.twoyu.taskifybackend.repository.TasksRepository;
import com.twoyu.taskifybackend.service.ITaskService;
import com.twoyu.taskifybackend.util.DateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TaskService implements ITaskService {

    private final TasksRepository tasksRepository;
    private final TasksLabelsRepository tasksLabelsRepository;
    @Override
    public TasksResponse addTask(AddTaskRequest request) {
        Tasks task = new Tasks();
        task.setName(request.getName());
        task.setDataIndex(request.getDataIndex());
        task.setStatusId(request.getStatusColumnId());
        task.setDescription("");
        task.setBoardId(request.getBoardId());
        task = tasksRepository.save(task);
        return TasksResponse.from(task, new ArrayList<>());
    }

    @Override
    public TasksResponse updateTask(UUID taskId, UpdateTaskRequest request) {
        Tasks task = tasksRepository.findById(taskId)
                .orElseThrow(TaskNotFoundException::new);
        if(StringUtils.isNotBlank(request.getName())){
            task.setName(request.getName());
        }

        if(request.getStartDate() != null){
            LocalDateTime startDate = DateUtils.dateStrToLocalDateTime(request.getStartDate());
            task.setStartDate(startDate);
        }

        if(request.getDueDate() != null){
            LocalDateTime dueDate = DateUtils.dateStrToLocalDateTime(request.getDueDate());
            task.setDueDate(dueDate);
        }
        task = tasksRepository.save(task);

        List<UUID> labelIdRes = tasksLabelsRepository.getLabelIdsByTaskId(taskId);


        return TasksResponse.from(task, labelIdRes);
    }

    @Override
    public DeleteTaskResponse deleteTask(UUID id) {
        tasksLabelsRepository.deleteAllByIdTaskId(id);
        tasksRepository.deleteById(id);
        log.info("Task deleted: {}", id);
        return new DeleteTaskResponse(id);
    }

    @Override
    public UpdateTaskDescResponse updateDesc(UUID id, UpdateTaskDescRequest request) {
        Tasks task = tasksRepository.findById(id)
                .orElseThrow(TaskNotFoundException::new);
        task.setDescription(request.getDescription());
        task = tasksRepository.save(task);
        return new UpdateTaskDescResponse(task.getId(), task.getDescription());
    }

    @Override
    public void addTaskLabel(UUID taskId, AddTaskLabelsRequest request) {
        if(!tasksRepository.existsById(taskId)){
            throw new TaskNotFoundException();
        }
        UUID labelId = request.getLabelId();
        TaskLabelsId id = new TaskLabelsId(taskId, labelId);
        TasksLabels tasksLabels = new TasksLabels(id);
        tasksLabelsRepository.save(tasksLabels);
        log.info("Task label added, taskId: {}, labelsId: {}", taskId, labelId);
    }

    @Override
    public void deleteTaskLabel(UUID taskId, UUID labelId) {
        tasksLabelsRepository.deleteById(new TaskLabelsId(taskId, labelId));
        log.info("Task label deleted, taskId: {}, labelsId: {}", taskId, labelId);
    }

    private void updateTaskLabel(Tasks task, List<UUID> labelIds){
        UUID taskId = task.getId();
        List<TasksLabels> tasksLabelsList = new ArrayList<>();
        tasksLabelsRepository.deleteAllByIdTaskId(taskId);
            for (UUID labelId : labelIds) {
                TaskLabelsId taskLabelsId = new TaskLabelsId(taskId, labelId);
                TasksLabels tasksLabel = new TasksLabels(taskLabelsId);
                tasksLabelsList.add(tasksLabel);
            }
            tasksLabelsRepository.saveAll(tasksLabelsList);
    }
}
