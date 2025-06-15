package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.CreateBoardRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateBoardRequest;
import com.twoyu.taskifybackend.model.vo.response.CreateBoardResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryBoardResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateBoardResponse;
import com.twoyu.taskifybackend.service.IBoardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
@Tag(name = "看板功能", description = "看板相關的API")
public class BoardController {

    private final IBoardService boardService;

    @PostMapping
    public CreateBoardResponse createBoard(@RequestBody @Valid CreateBoardRequest createBoardRequest){
        return boardService.createBoard(createBoardRequest);
    }

    @PutMapping("/{boardId}")
    public UpdateBoardResponse updateBoard(
            @PathVariable UUID boardId,
            @RequestBody @Valid UpdateBoardRequest updateBoardRequest){
        return boardService.updateBoard(boardId, updateBoardRequest);
    }

    @PostMapping("/{boardId}/toggle-pin")
    public void togglePinBoard(@PathVariable UUID boardId) {
        boardService.togglePinBoard(boardId);
    }

    @GetMapping("/all")
    public List<QueryBoardResponse> getAllBoards(){
        return  boardService.queryAllBoards();
    }

    @DeleteMapping("/{boardId}")
    public void deleteBoard(@PathVariable UUID boardId) {
        boardService.deleteBoard(boardId);
    }
}
