package com.twoyu.taskifybackend.core.mapper;

import com.twoyu.taskifybackend.model.entity.StatusColumn;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface StatusColumnMapper {
    AddColumnResponse toAddColumnResponse(StatusColumn statusColumn);
}
