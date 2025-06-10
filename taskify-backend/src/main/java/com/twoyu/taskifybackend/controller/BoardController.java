package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.response.QueryBoardResponse;
import com.twoyu.taskifybackend.service.IBoardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
@Tag(name = "看板功能", description = "看板相關的API")
public class BoardController {

    private final IBoardService boardService;

//    @PostMapping
//    public void add(){
//        Board board = new Board();
//        board.setName("TwoYu");
//        board.setDescription("TwoYu's board");
//        boardRepository.save(board);
//    }

    @GetMapping("/all")
    public List<QueryBoardResponse> getAllBoards(){
        return  boardService.queryAllBoards();
    }
}
