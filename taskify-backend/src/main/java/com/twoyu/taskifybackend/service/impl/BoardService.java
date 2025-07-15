package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.enums.UserBoardRole;
import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.entity.*;
import com.twoyu.taskifybackend.model.vo.request.CreateBoardRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateBoardRequest;
import com.twoyu.taskifybackend.model.vo.response.CreateBoardResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryBoardDetailResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryBoardResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateBoardResponse;
import com.twoyu.taskifybackend.repository.*;
import com.twoyu.taskifybackend.service.IBoardService;
import com.twoyu.taskifybackend.util.DateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService implements IBoardService {
    private final BoardRepository boardRepository;
    private final UsersRepository usersRepository;
    private final UserBoardRepository userBoardRepository;
    private final TasksRepository tasksRepository;
    private final TasksLabelsRepository tasksLabelsRepository;
    private final LabelsRepository labelsRepository;
    private final StatusColumnRepository statusColumnRepository;
    /**
     * 查詢看板列表
     * @return
     */
    @Override
    public List<QueryBoardResponse> queryAllBoards() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        List<Board> userBoards = boardRepository.findBoardsByUserEmail(userEmail);
        return userBoards.stream().map(board ->
             new QueryBoardResponse(
                    board.getId(),
                    board.getName(),
                    board.getDescription(),
                    DateUtils.dateToDateStr(board.getCreatedAt()),
                    DateUtils.dateToDateStr(board.getModifiedAt()),
                    board.getIcon(),
                    board.getThemeColor(),
                    DateUtils.dateToDateStr(board.getPinnedAt()))
        ).toList();
    }

    /**
     * 新增看板
     * @param request 新增看板 request
     * @return
     */
    @Override
    @Transactional
    public CreateBoardResponse createBoard(CreateBoardRequest request) {
        Users user = getCurrentUser();
        Board board = new Board();
        board.setName(request.getName());
        board.setDescription(request.getDescription());
        board.setCreatedAt(LocalDateTime.now());
        board.setIcon(request.getIcon());
        board.setThemeColor(request.getThemeColor());
        board = boardRepository.save(board);

        UserBoard userBoard = new UserBoard();
        UserBoardId userBoardId = new UserBoardId();
        userBoardId.setUserId(user.getId());
        userBoardId.setBoardId(board.getId());
        userBoard.setId(userBoardId);
        userBoard.setRole(UserBoardRole.OWNER);
        userBoardRepository.save(userBoard);

        return new CreateBoardResponse("Create Board Success", board.getName());
    }

    /**
     * 更新看板資訊
     * @param boardId 看板ID
     * @param request 更新看板 request
     * @return UpdateBoardResponse
     */
    @Override
    public UpdateBoardResponse updateBoard(UUID boardId, UpdateBoardRequest request) {
        checkBoardPermission(boardId);

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ServiceException("Board Not Found"));
        board.setName(request.getName());
        board.setDescription(request.getDescription());
        board.setIcon(request.getIcon());
        board.setThemeColor(request.getThemeColor());
        board.setModifiedAt(LocalDateTime.now());

        boardRepository.save(board);
        return new UpdateBoardResponse("Update Board Success", board.getName());
    }

    @Override
    public void togglePinBoard(UUID boardId) {
        checkBoardPermission(boardId);
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ServiceException("Board Not Found"));
        if(board.getPinnedAt() == null) {
            log.info("Pinning board: {}", boardId);
            board.setPinnedAt(LocalDateTime.now());
        } else {
            log.info("Unpinning board: {}", boardId);
            board.setPinnedAt(null);
        }
        boardRepository.save(board);
    }

    /**
     * 刪除看板
     * @param boardId 看板ID
     */
    @Transactional
    @Override
    public void deleteBoard(UUID boardId) {
        checkBoardPermission(boardId);
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ServiceException("Board Not Found"));

        log.info("Deleting User board...");
        userBoardRepository.deleteByIdBoardId(boardId);

        List<Tasks> tasksByBoard = tasksRepository.findAllByBoardId(boardId);
        List<UUID> taskIds = tasksByBoard.stream()
                .map(Tasks::getId)
                .toList();
        log.info("Delete tasks_labels for board: {}", boardId);
        tasksLabelsRepository.deleteByIdTaskIdIn(taskIds);

        log.info("Deleting tasks for board: {}", boardId);
        tasksRepository.deleteAll(tasksByBoard);

        log.info("Deleting labels for board: {}", boardId);
        labelsRepository.deleteByBoardId(boardId);

        log.info("Deleting status columns for board: {}", boardId);
        statusColumnRepository.deleteByBoardId(boardId);

        log.info("Deleting board: {}", boardId);
        boardRepository.delete(board);

    }

    /**
     * 查詢看板詳細資訊
     * @param boardId 看板ID
     * @return QueryBoardDetailResponse
     */
    @Override
    public QueryBoardDetailResponse queryBoardDetail(UUID boardId) {
        Users user = getCurrentUser();
        Board board = boardRepository.findByIdAndUserEmail(user.getEmail(), boardId)
                .orElseThrow(() -> new ServiceException("Board Not Found"));

        return new QueryBoardDetailResponse(
                board.getId(),
                board.getName(),
                board.getDescription(),
                board.getIcon(),
                board.getThemeColor(),
                DateUtils.dateToDateStr(board.getModifiedAt()),
                DateUtils.dateToDateStr(board.getCreatedAt()),
                DateUtils.dateToDateStr(board.getPinnedAt())
        );
    }

    /**
     * 檢查使用者是否有權限更新看板，以目前的情境來說是檢查看板是不是該使用者的
     * @param boardId 看板ID
     */
    private void checkBoardPermission(UUID boardId) {
        Users user = getCurrentUser();
        UserBoardId userBoardId = new UserBoardId();
        userBoardId.setBoardId(boardId);
        userBoardId.setUserId(user.getId());
        boolean isBoardExist = userBoardRepository.existsById(userBoardId);
        if (!isBoardExist) {
            throw new ServiceException("Board not found or You do not have permission to update this board");
        }
    }


    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ServiceException("User Not Found"));
    }
}
