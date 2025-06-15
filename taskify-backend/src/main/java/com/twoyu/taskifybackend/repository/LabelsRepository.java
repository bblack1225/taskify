package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.Labels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface LabelsRepository extends JpaRepository<Labels, UUID>, JpaSpecificationExecutor<Labels> {
    List<Labels> findAllByBoardId(UUID boardId);

    List<Labels> findAllByIdIn(List<UUID> ids);

    @Query(nativeQuery = true,
            value = """
            SELECT l.* FROM TASKS_LABELS tl 
            join LABELS l on tl.label_id = l.id
            where tl.task_id = :taskId
        """)
    List<Labels> getLabelsByTasksId(UUID taskId);

    void deleteByBoardId(UUID boardId);
}