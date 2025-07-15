package com.twoyu.taskifybackend.model.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateBoardRequest {
    @NotBlank
    @Size(max = 50)
    @Schema(defaultValue = "看板名稱", example = "TWO YU")
    private String name;

    @Schema(defaultValue = "看板描述", example = "TWO YU 的看板")
    private String description;

    @NotBlank
    @Schema(defaultValue = "看板的icon", example = "1f4cb")
    private String icon;

    @NotBlank
    @Schema(defaultValue = "看板主題色", example = "#E8F9FD")
    private String themeColor;
}
