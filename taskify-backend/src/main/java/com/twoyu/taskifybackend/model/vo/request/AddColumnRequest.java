package com.twoyu.taskifybackend.model.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NonNull;

import java.util.UUID;

@Data
public class AddColumnRequest {

    @NotNull
    @Schema(description = "整個Board的ID", example = "296a0423-d062-43d7-ad2c-b5be1012af96")
    private UUID boardId;

    @NotBlank
    @Size(max = 50)
    @Schema(description = "狀態列表的標題", example = "尚未開始")
    private String title;

    @NotNull
    @Schema(description = "狀態列表的排序", example = "0")
    private Integer dataIndex;
}
