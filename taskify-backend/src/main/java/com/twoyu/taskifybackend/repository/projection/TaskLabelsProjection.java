package com.twoyu.taskifybackend.repository.projection;

import java.util.UUID;

public interface TaskLabelsProjection {
    UUID getTaskId();
    String getTaskName();
    Integer getDataIndex();

    String getDescription();
    UUID  getColumnId();
    UUID getBoardId();
    UUID getLabelId();
    String getLabelName();
    String getLabelColor();
}
