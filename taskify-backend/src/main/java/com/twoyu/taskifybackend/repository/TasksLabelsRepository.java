package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.TaskLabelsId;
import com.twoyu.taskifybackend.model.entity.TasksLabels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface TasksLabelsRepository extends JpaRepository<TasksLabels, TaskLabelsId>, JpaSpecificationExecutor<TasksLabels> {
    void deleteAllByIdTaskId(UUID taskId);
}
