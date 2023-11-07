package com.twoyu.taskifybackend.service.impl;


import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.entity.*;
import com.twoyu.taskifybackend.model.vo.request.AddTaskRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateTaskRequest;
import com.twoyu.taskifybackend.model.vo.response.AddTaskResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateTaskResponse;
import com.twoyu.taskifybackend.repository.LabelsRepository;
import com.twoyu.taskifybackend.repository.StatusColumnRepository;
import com.twoyu.taskifybackend.repository.TasksLabelsRepository;
import com.twoyu.taskifybackend.repository.TasksRepository;
import com.twoyu.taskifybackend.service.ITaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TaskService implements ITaskService {

    private final TasksRepository tasksRepository;
    private final LabelsRepository labelsRepository;
    private final TasksLabelsRepository tasksLabelsRepository;
    @Override
    public AddTaskResponse addTask(AddTaskRequest request) {
        Tasks task = new Tasks();
        task.setName(request.getName());
        task.setDescription(request.getDescription());
        task.setDataIndex(request.getDataIndex());
        task.setStatusId(request.getStatusColumnId());
        task = tasksRepository.save(task);
        return new AddTaskResponse(
                task.getId(),
                task.getName(),
                task.getDescription(),
                task.getDataIndex(),
                task.getStatusId());
    }

    @Override
    public UpdateTaskResponse updateTask(UUID id, UpdateTaskRequest request) {
        Tasks task = tasksRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Task not found"));
        task.setName(request.getName());
        task.setDescription(request.getDescription());
        task = tasksRepository.save(task);
        List<UUID> labelIdList = labelsRepository.findAllByBoardId(request.getBoardId())
                .stream().map(Labels::getId).toList();
        UUID taskId = task.getId();
        List<TasksLabels> tasksLabelsList = new ArrayList<>();
        if(!request.getLabels().isEmpty()) {
            for (UUID labelId : request.getLabels()) {
                if (!labelIdList.contains(labelId)) {
                    throw new ServiceException("Label not found: " + labelId);
                }
                TaskLabelsId taskLabelsId = new TaskLabelsId(taskId, labelId);
                TasksLabels tasksLabel = new TasksLabels(taskLabelsId);
                tasksLabelsList.add(tasksLabel);
            }
            tasksLabelsRepository.saveAll(tasksLabelsList);
        }
        return new UpdateTaskResponse(
                task.getId(),
                task.getName(),
                task.getDescription(),
                task.getDataIndex(),
                task.getStatusId(),
                labelIdList);
    }

    @Override
    public UUID deleteTask(UUID id) {
        tasksLabelsRepository.deleteAllByIdTaskId(id);
        tasksRepository.deleteById(id);
        log.info("Task deleted: {}", id);
        return id;
    }
}
