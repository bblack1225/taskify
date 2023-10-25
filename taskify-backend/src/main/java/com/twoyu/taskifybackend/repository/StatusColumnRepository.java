package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.StatusColumn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface StatusColumnRepository extends JpaRepository<StatusColumn, UUID>, JpaSpecificationExecutor<StatusColumn> {
    List<StatusColumn> findAllByBoardId(UUID boardId);
}