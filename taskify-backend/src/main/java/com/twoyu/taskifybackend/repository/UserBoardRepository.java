package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.UserBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserBoardRepository extends JpaRepository<UserBoard, String>, JpaSpecificationExecutor<UserBoard> {

}