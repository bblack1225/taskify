package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.response.shared.LabelsResponse;

import java.util.List;
import java.util.UUID;

public interface ILabelService {
    List<LabelsResponse> getAllLabels(UUID boardId);
}
