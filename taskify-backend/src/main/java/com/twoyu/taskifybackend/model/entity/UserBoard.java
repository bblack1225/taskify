package com.twoyu.taskifybackend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "user_board")
public class UserBoard implements Serializable {

    private static final long serialVersionUID = 1L;

    @EmbeddedId
  private UserBoardId id;

}
