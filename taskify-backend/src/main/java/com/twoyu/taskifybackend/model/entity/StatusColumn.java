package com.twoyu.taskifybackend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

/**
 * 狀態欄
 */
@Data
@Entity
@Table(name = "status_column")
public class StatusColumn implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * 狀態欄的名稱
     */
    @Column(name = "title", nullable = false)
    private String title;

    /**
     * 狀態欄所代表的顏色
     */
    @Column(name = "color")
    private String color;

    /**
     * 狀態欄排序
     */
    @Column(name = "order", nullable = false)
    private Integer order;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @Column(name = "modified_at", insertable = false)
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime modifiedAt;

}
