package com.twoyu.taskifybackend.model.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateColumnTitleRequest {
    @NotBlank
    @Size(max = 50)
    @Schema(description = "列表標題", example = "尚未開始2")
    private String title;
}
