package com.twoyu.taskifybackend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "tasks_labels")
public class TasksLabels implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private TaskLabelsId id;

}
