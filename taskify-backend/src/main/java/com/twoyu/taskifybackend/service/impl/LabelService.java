package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.model.entity.Labels;
import com.twoyu.taskifybackend.model.vo.response.shared.LabelsResponse;
import com.twoyu.taskifybackend.repository.LabelsRepository;
import com.twoyu.taskifybackend.service.ILabelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class LabelService implements ILabelService {

    private final LabelsRepository labelsRepository;
    @Override
    public List<LabelsResponse> getAllLabels(UUID boardId) {
        List<Labels> labels = labelsRepository.findAllByBoardId(boardId);
        return LabelsResponse.from(labels);
    }
}
