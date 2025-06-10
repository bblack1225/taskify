package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.model.entity.Board;
import com.twoyu.taskifybackend.model.vo.response.QueryBoardResponse;
import com.twoyu.taskifybackend.repository.BoardRepository;
import com.twoyu.taskifybackend.repository.UsersRepository;
import com.twoyu.taskifybackend.service.IBoardService;
import com.twoyu.taskifybackend.util.DateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService implements IBoardService {

    private final BoardRepository boardRepository;

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
}
