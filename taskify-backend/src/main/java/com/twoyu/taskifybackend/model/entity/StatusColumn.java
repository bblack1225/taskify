package com.twoyu.taskifybackend.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

/**
 * 狀態欄
 */
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "status_column")
public class StatusColumn implements Serializable {

    @Serial
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
    @Column(name = "data_index", nullable = false)
    private Integer dataIndex;

    @Column(name = "board_id", nullable = false)
    private UUID boardId;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @Column(name = "modified_at", insertable = false)
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime modifiedAt;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StatusColumn that = (StatusColumn) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
