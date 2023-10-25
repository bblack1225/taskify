package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.entity.Board;
import com.twoyu.taskifybackend.model.entity.Labels;
import com.twoyu.taskifybackend.model.entity.StatusColumn;
import com.twoyu.taskifybackend.model.entity.Tasks;
import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnTitleRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryAllColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.shared.LabelsResponse;
import com.twoyu.taskifybackend.model.vo.response.shared.TaskColumnRes;
import com.twoyu.taskifybackend.model.vo.response.shared.TasksResponse;
import com.twoyu.taskifybackend.repository.BoardRepository;
import com.twoyu.taskifybackend.repository.LabelsRepository;
import com.twoyu.taskifybackend.repository.StatusColumnRepository;
import com.twoyu.taskifybackend.repository.TasksRepository;
import com.twoyu.taskifybackend.service.IStatusColumnService;
import lombok.RequiredArgsConstructor;
import org.hibernate.type.SerializationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StatusColumnService implements IStatusColumnService {

    private final StatusColumnRepository statusColumnRepository;
    private final TasksRepository tasksRepository;
    private final LabelsRepository labelsRepository;
    private final BoardRepository boardRepository;
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
        List<Labels> labels = labelsRepository.findAllByBoardId(boardId);
        List<LabelsResponse> labelsResponses = LabelsResponse.from(labels);
        response.setLabels(labelsResponses);

        List<StatusColumn> statusColumns = statusColumnRepository.findAllByBoardId(boardId);
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
            taskColumnRes.setCards(tasksResponses);
            // TODO labels
            return taskColumnRes;
        }).toList();
        response.setColumns(taskColumnResList);
        return response;
    }

    @Override
    public void updateTitle(UUID id, UpdateColumnTitleRequest request) {
        StatusColumn statusColumn = statusColumnRepository
                .findById(id).orElseThrow(() -> new ServiceException("StatusColumn id not found:" + id));
        statusColumn.setTitle(request.getTitle());
        statusColumnRepository.save(statusColumn);
    }
}
