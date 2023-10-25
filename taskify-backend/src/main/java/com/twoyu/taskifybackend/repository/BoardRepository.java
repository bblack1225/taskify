package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID>, JpaSpecificationExecutor<Board> {

}