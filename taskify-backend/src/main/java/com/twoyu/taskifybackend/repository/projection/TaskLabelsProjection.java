package com.twoyu.taskifybackend.repository.projection;

import java.util.List;
import java.util.UUID;

public interface TaskLabelsProjection {
    UUID getTaskId();
    String getTaskName();
    Integer getDataIndex();

    String getDescription();
    UUID  getColumnId();
}
