package com.twoyu.taskifybackend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Data
@Entity
@Table(name = "labels")
public class Labels implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "board_id")
    private UUID boardId;

    @Column(name = "name", nullable = false)
    private String ame;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "modified_at", insertable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private LocalDateTime modifiedAt;

}
