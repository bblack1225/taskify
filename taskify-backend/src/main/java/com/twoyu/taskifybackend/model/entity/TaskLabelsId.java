package com.twoyu.taskifybackend.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskLabelsId implements Serializable {
    @Column(name = "task_id", nullable = false)
    private UUID taskId;

    @Column(name = "label_id", nullable = false)
    private UUID labelId;
}
