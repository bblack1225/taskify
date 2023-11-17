package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.Labels;
import com.twoyu.taskifybackend.model.entity.TaskLabelsId;
import com.twoyu.taskifybackend.model.entity.TasksLabels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.scheduling.config.Task;

import java.util.List;
import java.util.UUID;

public interface TasksLabelsRepository extends JpaRepository<TasksLabels, TaskLabelsId>, JpaSpecificationExecutor<TasksLabels> {
    void deleteAllByIdTaskId(UUID taskId);
    @Query(nativeQuery = true,
            value = """
            SELECT tl.* as labelId FROM TASKS_LABELS tl 
            join tasks t on tl.task_id = t.id
            join board b on b.id = t.board_id
            where b.id = :boardId
            """)
    List<TasksLabels> findAllByBoardId(UUID boardId);
}
