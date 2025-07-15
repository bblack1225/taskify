package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.CreateBoardRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateBoardRequest;
import com.twoyu.taskifybackend.model.vo.response.CreateBoardResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryBoardDetailResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryBoardResponse;
import com.twoyu.taskifybackend.model.vo.response.UpdateBoardResponse;
import com.twoyu.taskifybackend.service.IBoardService;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(description = "新增看板")
    @PostMapping
    public CreateBoardResponse createBoard(@RequestBody @Valid CreateBoardRequest createBoardRequest){
        return boardService.createBoard(createBoardRequest);
    }

    @Operation(description = "更新看板資訊")
    @PutMapping("/{boardId}")
    public UpdateBoardResponse updateBoard(
            @PathVariable UUID boardId,
            @RequestBody @Valid UpdateBoardRequest updateBoardRequest){
        return boardService.updateBoard(boardId, updateBoardRequest);
    }

    @Operation(description = "切換看板的置頂狀態")
    @PostMapping("/{boardId}/toggle-pin")
    public void togglePinBoard(@PathVariable UUID boardId) {
        boardService.togglePinBoard(boardId);
    }

    @Operation(description = "查詢所有看板")
    @GetMapping("/all")
    public List<QueryBoardResponse> getAllBoards(){
        return  boardService.queryAllBoards();
    }

    @Operation(description = "刪除看板")
    @DeleteMapping("/{boardId}")
    public void deleteBoard(@PathVariable UUID boardId) {
        boardService.deleteBoard(boardId);
    }

    @Operation(description = "查詢看板詳細資訊")
    @GetMapping("/{boardId}")
    public QueryBoardDetailResponse queryBoardDetail(@PathVariable UUID boardId){
        return boardService.queryBoardDetail(boardId);
    }
}
