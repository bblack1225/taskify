package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.request.CreateBoardRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateBoardRequest;
import com.twoyu.taskifybackend.model.vo.response.CreateBoardResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryBoardResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateBoardResponse;

import java.util.List;
import java.util.UUID;

public interface IBoardService {

    List<QueryBoardResponse> queryAllBoards();
    CreateBoardResponse createBoard(CreateBoardRequest request);
    UpdateBoardResponse updateBoard(UUID boardId, UpdateBoardRequest request);
    void togglePinBoard(UUID boardId);
    void deleteBoard(UUID boardId);
}
