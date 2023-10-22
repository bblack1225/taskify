package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnRes;
import com.twoyu.taskifybackend.service.IStatusColumnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statusCol")
@RequiredArgsConstructor
public class StatusColumnController {
    private final IStatusColumnService statusColumnService;

    @PostMapping
    public AddColumnRes addColumn(@Valid @RequestBody AddColumnRequest request){
        return statusColumnService.addColumn(request);
    }

}
