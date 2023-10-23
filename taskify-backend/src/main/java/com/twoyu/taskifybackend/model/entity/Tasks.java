package com.twoyu.taskifybackend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "tasks")
public class Tasks implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * 任務名稱
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * 任務在欄中的排序
     */
    @Column(name = "order", nullable = false)
    private Integer order;

    /**
     * 任務描述
     */
    @Column(name = "description")
    private String description;

    /**
     * 所屬狀態列id
     */
    @Column(name = "status_id", nullable = false)
    private UUID statusId;


    /**
     * 建立日期
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    /**
     * 修改日期
     */
    @Column(name = "modified_at", insertable = false)
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime modifiedAt;
}
