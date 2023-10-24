package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.model.entity.StatusColumn;
import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;
import com.twoyu.taskifybackend.repository.StatusColumnRepository;
import com.twoyu.taskifybackend.service.IStatusColumnService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class StatusColumnService implements IStatusColumnService {

    private final StatusColumnRepository statusColumnRepository;

    @Override
    public AddColumnResponse addColumn(AddColumnRequest addColumnRequest) {
        StatusColumn statusColumn = new StatusColumn();
        statusColumn.setTitle(addColumnRequest.getTitle());
        statusColumn.setDataIndex(addColumnRequest.getDataIndex());
        statusColumn.setBoardId(addColumnRequest.getBoardId());
        statusColumn = statusColumnRepository.save(statusColumn);
        return new AddColumnResponse(
                statusColumn.getId(),
                statusColumn.getBoardId(),
                statusColumn.getTitle(),
                statusColumn.getDataIndex()
        );
    }
}
