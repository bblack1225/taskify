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

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "tasks")
public class Tasks implements Serializable {

    @Serial
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
    @Column(name = "data_index", nullable = false)
    private Integer dataIndex;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tasks tasks = (Tasks) o;
        return Objects.equals(id, tasks.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
