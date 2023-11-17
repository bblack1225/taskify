package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.dto.TasksDto;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StatusColumnService implements IStatusColumnService {

    private final StatusColumnRepository statusColumnRepository;
    private final TasksRepository tasksRepository;
    private final LabelsRepository labelsRepository;
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
    public QueryAllColumnResponse queryAll(UUID boardId) {
        QueryAllColumnResponse response = new QueryAllColumnResponse();
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new ServiceException("Board id not found:" + boardId));
        response.setBoardId(boardId);
        response.setBoardName(board.getName());
        List<TasksDto> tasksDtos =  tasksRepository.getAllTasksWithLabelsId(boardId)
                .stream().map(TasksDto::fromProjection).toList();
        log.info("tasksDtos: {}", tasksDtos);
//        List<Labels> labels = labelsRepository.findAllByBoardId(boardId);
//        List<LabelsResponse> labelsResponses = LabelsResponse.from(labels);
//        response.setLabels(labelsResponses);

        List<StatusColumn> statusColumns = statusColumnRepository.findAllByBoardIdOrderByDataIndex(boardId);
        List<TaskColumnRes> taskColumnResList = statusColumns.stream().map(statusColumn -> {
            TaskColumnRes taskColumnRes = new TaskColumnRes();
            taskColumnRes.setId(statusColumn.getId());
            taskColumnRes.setTitle(statusColumn.getTitle());
            taskColumnRes.setColor(statusColumn.getColor());
            taskColumnRes.setDataIndex(statusColumn.getDataIndex());
            List<Tasks> tasksByStatusId = tasksRepository.findAllByStatusId(statusColumn.getId());
            List<TasksResponse> tasksResponses = tasksByStatusId.stream().map(
                    task -> TasksResponse.builder()
                            .id(task.getId())
                            .name(task.getName())
                            .dataIndex(task.getDataIndex())
                            .description(task.getDescription())
                            .labels(new ArrayList<>())
                            .build()
            ).toList();
            taskColumnRes.setTasks(tasksResponses);
            // TODO labels
            return taskColumnRes;
        }).toList();
        response.setColumns(taskColumnResList);
        return response;
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
//        List<Tasks> updatedTasks = tasksRepository
//                .findAllByStatusId(id)
//                .stream().peek(task -> task.setDelete(true)).toList();
//        tasksRepository.saveAll(updatedTasks);
        tasksRepository.deleteAllByStatusId(id);
        statusColumnRepository.deleteById(id);
        log.info("Delete status column id success:{}", id);
        return new DeleteColumnResponse(id);
    }

    @Override
    public QueryBaseDataResponse queryBaseData(UUID boardId) {
        Map<UUID, Labels> labels = labelsRepository.findAllByBoardId(boardId)
                .stream().collect(Collectors.toMap(Labels::getId, label -> label));

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
        List<Tasks> tasksDTOs =  tasksRepository.findAllByBoardId(boardId);
        List<TasksResponse> tasksResponses = tasksDTOs.stream().map(task -> {
            TasksResponse tasksResponse = new TasksResponse();
            tasksResponse.setId(task.getId());
            tasksResponse.setName(task.getName());
            tasksResponse.setDataIndex(task.getDataIndex());
            tasksResponse.setDescription(task.getDescription());
            List<UUID> labelIds = map.get(task.getId());
            if(labelIds != null) {
                List<TaskLabelRes> labelsResponses = labelIds.stream().map(labelId -> {
                    Labels label = labels.get(labelId);
                    return TaskLabelRes.builder()
                            .id(label.getId())
                            .name(label.getName())
                            .color(label.getColor())
                            .build();
                }).toList();
                tasksResponse.setLabels(labelsResponses);
            } else {
                tasksResponse.setLabels(new ArrayList<>());
            }
            tasksResponse.setColumnId(task.getStatusId());
            return tasksResponse;
        }).toList();
        res.setTasks(tasksResponses);
        return res;
    }
}
