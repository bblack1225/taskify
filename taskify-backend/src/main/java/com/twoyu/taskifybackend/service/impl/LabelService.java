package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.entity.Labels;
import com.twoyu.taskifybackend.model.vo.request.LabelMutateRequest;
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
        return LabelsResponse.fromList(labels);
    }

    @Override
    public LabelsResponse addLabel(UUID boardId, LabelMutateRequest request) {
        Labels label = new Labels();
        label.setBoardId(boardId);
        label.setName(request.getName());
        label.setColor(request.getColor());
        label = labelsRepository.save(label);
        return LabelsResponse.from(label);
    }

    @Override
    public LabelsResponse updateLabel(UUID labelId, LabelMutateRequest request) {
        Labels label = labelsRepository.findById(labelId)
                .orElseThrow(() -> new ServiceException("Label Not Found!"));
        label.setName(request.getName());
        label.setColor(request.getColor());
        label = labelsRepository.save(label);
        return LabelsResponse.from(label);
    }

    @Override
    public void deleteLabel(UUID labelId) {
        labelsRepository.deleteById(labelId);
    }

}
