package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.model.entity.StatusColumn;
import com.twoyu.taskifybackend.model.vo.request.AddColumnRequest;
import com.twoyu.taskifybackend.model.vo.response.AddColumnResponse;
import com.twoyu.taskifybackend.repository.StatusColumnRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class StatusColumnServiceTest {

    @MockBean
    private StatusColumnRepository statusColumnRepository;

    @Autowired
    private StatusColumnService statusColumnService;


        // Given a valid AddColumnRequest, it should create a new StatusColumn with the same properties as the request and return an AddColumnResponse with the same properties as the created StatusColumn.
        @Test
        public void test_validAddColumnRequest() {
            // Create a valid AddColumnRequest
            AddColumnRequest addColumnRequest = new AddColumnRequest();
            addColumnRequest.setBoardId(UUID.randomUUID());
            addColumnRequest.setTitle("Test Title");
            addColumnRequest.setDataIndex(0.0);

            // Mock the statusColumnRepository.save() method
            StatusColumn savedStatusColumn = new StatusColumn();
            savedStatusColumn.setId(UUID.randomUUID());
            savedStatusColumn.setBoardId(addColumnRequest.getBoardId());
            savedStatusColumn.setTitle(addColumnRequest.getTitle());
            savedStatusColumn.setDataIndex(addColumnRequest.getDataIndex());
            Mockito.when(statusColumnRepository.save(Mockito.any(StatusColumn.class))).thenReturn(savedStatusColumn);

            // Call the addColumn method
            AddColumnResponse response = statusColumnService.addColumn(addColumnRequest);

            // Verify that the statusColumnRepository.save() method was called with the correct arguments
            Mockito.verify(statusColumnRepository).save(Mockito.any(StatusColumn.class));

            // Verify that the response has the same properties as the created StatusColumn
            assertEquals(savedStatusColumn.getId(), response.id());
            assertEquals(savedStatusColumn.getBoardId(), response.boardId());
            assertEquals(savedStatusColumn.getTitle(), response.title());
            assertEquals(savedStatusColumn.getDataIndex(), response.dataIndex());
        }

}