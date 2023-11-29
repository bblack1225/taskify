package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.vo.request.LabelMutateRequest;
import com.twoyu.taskifybackend.model.vo.response.shared.LabelsResponse;
import com.twoyu.taskifybackend.service.ILabelService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/labels")
@RequiredArgsConstructor
@Tag(name = "標籤功能", description = "標籤相關的API")
public class LabelController {
    private final ILabelService labelService;

    @GetMapping("/all/{boardId}")
    public List<LabelsResponse> getAllLabels(@PathVariable  UUID boardId){
        return labelService.getAllLabels(boardId);
    }

    @PostMapping("/{boardId}")
    public LabelsResponse addLabel(@PathVariable UUID boardId, @RequestBody LabelMutateRequest request){
        return labelService.addLabel(boardId, request);
    }

    @PutMapping("/{labelId}")
    public LabelsResponse updateLabel(@PathVariable UUID labelId, @RequestBody LabelMutateRequest request){
        return labelService.updateLabel(labelId, request);
    }

    @DeleteMapping("/{labelId}")
    public void deleteLabel(@PathVariable UUID labelId){
        labelService.deleteLabel(labelId);
    }


}
