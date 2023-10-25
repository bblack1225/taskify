package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnTitleRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryAllColumnResponse;
import com.twoyu.taskifybackend.service.IStatusColumnService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/statusCol")
@RequiredArgsConstructor
public class StatusColumnController {
    private final IStatusColumnService statusColumnService;

    @Operation(summary = "新增一個狀態看板")
    @PostMapping
    public AddColumnResponse addColumn(@Valid @RequestBody AddColumnRequest request){
        return statusColumnService.addColumn(request);
    }

    @Operation(summary = "修改看板的標題")
    @PutMapping("/{id}")
    // TODO 看需不需要回傳值
    public void updateTitle(@PathVariable UUID id, @Valid @RequestBody UpdateColumnTitleRequest request){
        statusColumnService.updateTitle(id, request);
    }

    @Operation(summary = "刪除一個狀態看板")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id){
//        statusColumnService.delete(id);
    }

    @Operation(summary = "取得所有狀態看板")
    @GetMapping("/all/{boardId}")
    public QueryAllColumnResponse getAll(@PathVariable("boardId") UUID boardId){
        return statusColumnService.queryAll(boardId);
    }

}
