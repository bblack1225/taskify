package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.Tasks;
import com.twoyu.taskifybackend.repository.projection.TaskLabelsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TasksRepository extends JpaRepository<Tasks, UUID>, JpaSpecificationExecutor<Tasks> {


    List<Tasks> findAllByStatusId(UUID statusId);

    void deleteAllByStatusId(UUID statusId);

    List<Tasks> findAllByBoardId(UUID boardId);

    @Query(nativeQuery = true,
    value = """
            SELECT t.id as taskId, t.name as taskName, t.data_index as dataIndex, 
             t.description as description, t.status_id as columnId,
              tl.label_id as labelId FROM TASKS t 
              left join TASKS_LABELS tl on t.id = tl.task_id 
             where t.board_id = :boardId
            """)
    List<TaskLabelsProjection> getAllTasksWithLabelsId(UUID boardId);

}