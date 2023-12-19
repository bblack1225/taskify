package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.request.UpdateColumnTitleRequest;
import com.twoyu.taskifybackend.model.vo.response.*;
import com.twoyu.taskifybackend.service.IStatusColumnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public UpdateColumnTitleResponse updateTitle(@PathVariable UUID id, @Valid @RequestBody UpdateColumnTitleRequest request){
        return statusColumnService.updateTitle(id, request);
    }

    @Operation(summary = "刪除一個狀態看板")
    @DeleteMapping("/{id}")
    public DeleteColumnResponse delete(@PathVariable("id") UUID id){
        return statusColumnService.delete(id);
    }

    @Operation(summary = "取得所有狀態列表")
    @GetMapping("/v2/all/{boardId}")
    public QueryBaseDataResponse getBaseData(@PathVariable("boardId") UUID boardId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getName());
        return statusColumnService.queryBaseData(boardId);
    }

}
