package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnTitleRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;
import com.twoyu.taskifybackend.model.vo.response.QueryAllColumnResponse;
import com.twoyu.taskifybackend.service.IStatusColumnService;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/statusCol")
@RequiredArgsConstructor
@Tag(name = "狀態列表功能", description = "狀態列表相關的API")
public class StatusColumnController {
    private final IStatusColumnService statusColumnService;

    @Operation(summary = "新增一個狀態列表")
    @PostMapping
    public AddColumnResponse addColumn(@Valid @RequestBody AddColumnRequest request){
        return statusColumnService.addColumn(request);
    }

    @Operation(summary = "修改狀態列表的標題(直接去點擊列表的Textarea)")
    @PutMapping("/{id}")
    // TODO 看需不需要回傳值
    public void updateTitle(@PathVariable UUID id, @Valid @RequestBody UpdateColumnTitleRequest request){
        statusColumnService.updateTitle(id, request);
    }

//    @Operation(summary = "刪除一個狀態看板")
//    @DeleteMapping("/{id}")
//    public void delete(@PathVariable("id") String id){
//        statusColumnService.delete(id);
//    }

    @Operation(summary = "取得所有狀態列表")
    @GetMapping("/all/{boardId}")
    public QueryAllColumnResponse getAll(@PathVariable("boardId") UUID boardId){
        return statusColumnService.queryAll(boardId);
    }

}
