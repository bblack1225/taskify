package com.twoyu.taskifybackend.repository;

import com.twoyu.taskifybackend.model.entity.Labels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface LabelsRepository extends JpaRepository<Labels, UUID>, JpaSpecificationExecutor<Labels> {

}