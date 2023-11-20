package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.LabelMutateRequest;
import com.twoyu.taskifybackend.model.vo.response.shared.LabelsResponse;

import java.util.List;
import java.util.UUID;

public interface ILabelService {
    List<LabelsResponse> getAllLabels(UUID boardId);

    LabelsResponse addLabel(UUID boardId, LabelMutateRequest request);

    LabelsResponse updateLabel(UUID labelId, LabelMutateRequest request);

    void deleteLabel(UUID labelId);
}
