package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.entity.*;
import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnTitleRequest;
import com.twoyu.taskifybackend.model.vo.response.*;
import com.twoyu.taskifybackend.model.vo.response.shared.*;
import com.twoyu.taskifybackend.repository.*;
import com.twoyu.taskifybackend.service.IStatusColumnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StatusColumnService implements IStatusColumnService {

    private final StatusColumnRepository statusColumnRepository;
    private final TasksRepository tasksRepository;
    private final BoardRepository boardRepository;
    private final TasksLabelsRepository tasksLabelsRepository;
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
    @Override
    public UpdateColumnTitleResponse updateTitle(UUID id, UpdateColumnTitleRequest request) {
        StatusColumn statusColumn = statusColumnRepository
                .findById(id).orElseThrow(() -> new ServiceException("StatusColumn id not found:" + id));
        statusColumn.setTitle(request.getTitle());
        statusColumn = statusColumnRepository.save(statusColumn);
        return new UpdateColumnTitleResponse(
                statusColumn.getId(),
                statusColumn.getBoardId(),
                statusColumn.getTitle(),
                statusColumn.getDataIndex());
    }

    @Override
    public DeleteColumnResponse delete(UUID id) {
        List<TasksLabels> tasksLabels = tasksLabelsRepository.findAllByColumnId(id);
        tasksLabelsRepository.deleteAll(tasksLabels);
        tasksRepository.deleteAllByStatusId(id);
        statusColumnRepository.deleteById(id);
        log.info("Delete status column id success:{}", id);
        return new DeleteColumnResponse(id);
    }

    @Override
    public QueryBaseDataResponse queryBaseData(UUID boardId) {

    // TODO 待重構
        QueryBaseDataResponse res = new QueryBaseDataResponse();
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ServiceException("Board id not found:" + boardId));
        res.setBoardId(boardId);
        res.setBoardName(board.getName());
        List<StatusColumn> statusColumns = statusColumnRepository
                .findAllByBoardIdOrderByDataIndex(boardId);
        List<StatusColumnResponse> statusColumnResList = statusColumns.stream().map(column -> {
            StatusColumnResponse statusColumnRes = new StatusColumnResponse();
            statusColumnRes.setId(column.getId());
            statusColumnRes.setTitle(column.getTitle());
            statusColumnRes.setColor(column.getColor());
            statusColumnRes.setDataIndex(column.getDataIndex());
            return statusColumnRes;
        }).toList();
        res.setColumns(statusColumnResList);
        List<TasksLabels> tasksLabels = tasksLabelsRepository.findAllByBoardId(boardId);
        Map<UUID, List<UUID>> map = new HashMap<>();
        for (TasksLabels tasksLabel : tasksLabels) {
            List<UUID> uuids = map.getOrDefault(tasksLabel.getId().getTaskId(), new ArrayList<>());
            uuids.add(tasksLabel.getId().getLabelId());
            map.put(tasksLabel.getId().getTaskId(), uuids);
        }
        List<Tasks> tasksDTOs =  tasksRepository.findAllByBoardIdOrderByDataIndex(boardId);
        List<TasksResponse> tasksResponses = tasksDTOs.stream().map(task -> {
            TasksResponse tasksResponse = new TasksResponse();
            tasksResponse.setId(task.getId());
            tasksResponse.setName(task.getName());
            tasksResponse.setDataIndex(task.getDataIndex());
            tasksResponse.setDescription(task.getDescription());
            tasksResponse.setStartDate(task.getStartDate());
            tasksResponse.setDueDate(task.getDueDate());

            List<UUID> labelIds = map.getOrDefault(task.getId(), new ArrayList<>());
            tasksResponse.setLabels(labelIds);
            tasksResponse.setColumnId(task.getStatusId());
            return tasksResponse;
        }).toList();
        res.setTasks(tasksResponses);
        return res;
    }
}
