package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<Board, UUID>, JpaSpecificationExecutor<Board> {

    @Query("""
            SELECT b FROM Board b
            JOIN UserBoard ub ON b.id = ub.id.boardId
            JOIN Users u ON ub.id.userId = u.id
            WHERE u.email = :email
            ORDER BY b.pinnedAt DESC NULLS LAST, b.createdAt DESC
            """)
    List<Board> findBoardsByUserEmail(@Param("email") String email);
}