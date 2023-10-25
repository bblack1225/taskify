package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.entity.Board;
import com.twoyu.taskifybackend.model.vo.response.QueryBoardResponse;
import com.twoyu.taskifybackend.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {
    private final BoardRepository boardRepository;

    @PostMapping
    public void add(){
        Board board = new Board();
        board.setName("TwoYu");
        board.setDescription("TwoYu's board");
        boardRepository.save(board);
    }

    @GetMapping
    public List<QueryBoardResponse> getAllData(){
        List<Board> boardList = boardRepository.findAll();
        return boardList.stream().map(
                board ->
                     new QueryBoardResponse(board.getId(), board.getName(), board.getDescription())
        ).collect(Collectors.toList());
    }
}
