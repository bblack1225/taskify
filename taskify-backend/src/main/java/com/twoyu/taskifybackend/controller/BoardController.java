package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.entity.Board;
import com.twoyu.taskifybackend.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public void getAllData(){

    }
}
