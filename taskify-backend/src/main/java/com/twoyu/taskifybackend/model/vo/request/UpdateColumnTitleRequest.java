package com.twoyu.taskifybackend.model.vo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateColumnTitleRequest {
    @NotBlank
    @Size(max = 50)
    private String title;
}
