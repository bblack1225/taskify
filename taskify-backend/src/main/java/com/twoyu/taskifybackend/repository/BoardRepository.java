package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BoardRepository extends JpaRepository<Board, String>, JpaSpecificationExecutor<Board> {

}