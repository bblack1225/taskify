package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.UserBoard;
import com.twoyu.taskifybackend.model.entity.UserBoardId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface UserBoardRepository extends JpaRepository<UserBoard, UserBoardId>, JpaSpecificationExecutor<UserBoard> {
    List<UserBoard> findByIdUserId(UUID userId);
}