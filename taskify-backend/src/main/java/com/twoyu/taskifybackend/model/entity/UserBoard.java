package com.twoyu.taskifybackend.model.entity;

import com.twoyu.taskifybackend.enums.UserBoardRole;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
@Table(name = "user_board")
public class UserBoard implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private UserBoardId id;

    @Enumerated(EnumType.STRING)
    private UserBoardRole role;

}
