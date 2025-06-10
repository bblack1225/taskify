package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.response.QueryBoardResponse;

import java.util.List;

public interface IBoardService {

    List<QueryBoardResponse> queryAllBoards();
}
