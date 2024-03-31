package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.entity.*;
import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnRequest;
import com.twoyu.taskifybackend.model.vo.response.*;
import com.twoyu.taskifybackend.model.vo.response.shared.*;
import com.twoyu.taskifybackend.repository.*;
import com.twoyu.taskifybackend.service.IStatusColumnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StatusColumnService implements IStatusColumnService {

    private final StatusColumnRepository statusColumnRepository;
    private final TasksRepository tasksRepository;
    private final BoardRepository boardRepository;
    private final TasksLabelsRepository tasksLabelsRepository;
    private static final Double BASE_DATA_INDEX = 65536.0;
    private static final Double BASE_RESET_DATA_INDEX = 16384.0;
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
    public UpdateColumnResponse updateTitle(UUID id, UpdateColumnRequest request) {
        StatusColumn statusColumn = statusColumnRepository
                .findById(id).orElseThrow(() -> new ServiceException("StatusColumn id not found:" + id));
        statusColumn.setTitle(request.getTitle());

        statusColumn.setDataIndex(request.getDataIndex());
        statusColumn = statusColumnRepository.save(statusColumn);

        // TODO 如果遇到 dataIndex 為小數點的情況，要進行處理
        if(request.getDataIndex() < 1){
            UUID boardId = statusColumn.getBoardId();
            List<StatusColumn> statusColumns = statusColumnRepository.findAllByBoardIdOrderByDataIndex(boardId);
//            for(int i = 1; i <= statusColumns.size(); i++){
//                StatusColumn column = statusColumns.get(i);
//                column.setDataIndex(column.getDataIndex() + BASE_DATA_INDEX);
//            }
            IntStream.range(0, statusColumns.size()).forEach(i -> {
                StatusColumn column = statusColumns.get(i);
                column.setDataIndex(BASE_RESET_DATA_INDEX * (i + 1));
            });
            statusColumnRepository.saveAll(statusColumns);
            Map<UUID, Double> columnIndexMap = statusColumns.stream().collect(
                    Collectors.toMap(StatusColumn::getId, StatusColumn::getDataIndex)
            );
            return new UpdateColumnResponse(
                    statusColumn.getId(),
                    statusColumn.getBoardId(),
                    statusColumn.getTitle(),
                    statusColumn.getDataIndex(),
                    columnIndexMap);
        }

        return new UpdateColumnResponse(
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
        Map<UUID, List<UUID>> taskLabelsMap = new HashMap<>();
        for (TasksLabels tasksLabel : tasksLabels) {
            List<UUID> labelIdsByTask = taskLabelsMap.getOrDefault(tasksLabel.getId().getTaskId(), new ArrayList<>());
            labelIdsByTask.add(tasksLabel.getId().getLabelId());
            taskLabelsMap.put(tasksLabel.getId().getTaskId(), labelIdsByTask);
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

            List<UUID> labelIds = taskLabelsMap.getOrDefault(task.getId(), new ArrayList<>());
            tasksResponse.setLabels(labelIds);
            tasksResponse.setColumnId(task.getStatusId());
            return tasksResponse;
        }).toList();
        res.setTasks(tasksResponses);
        return res;
    }
}
