package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.Tasks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface TasksRepository extends JpaRepository<Tasks, UUID>, JpaSpecificationExecutor<Tasks> {


    List<Tasks> findAllByStatusId(UUID statusId);

    void deleteAllByStatusId(UUID statusId);


}