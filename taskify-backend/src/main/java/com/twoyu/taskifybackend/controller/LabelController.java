package com.twoyu.taskifybackend.controller;

import com.twoyu.taskifybackend.model.entity.Labels;
import com.twoyu.taskifybackend.model.vo.response.shared.LabelsResponse;
import com.twoyu.taskifybackend.repository.LabelsRepository;
import com.twoyu.taskifybackend.service.ILabelService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
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

//    @PostMapping
//    public void saveAll(){
//        List<String> colors = Arrays.asList("red", "orange", "yellow", "green"
//                , "blue", "purple", "pink", "brown", "gray");
//        List<Labels> labels = new ArrayList<>();
//        for (String color : colors) {
//            Labels label = new Labels();
//            label.setName("");
//            label.setColor(color);
//            UUID boardId = UUID.fromString("296a0423-d062-43d7-ad2c-b5be1012af96");
//            label.setBoardId(boardId);
//            labels.add(label);
//        }
//        labelsRepository.saveAll(labels);
//
//    }
}
