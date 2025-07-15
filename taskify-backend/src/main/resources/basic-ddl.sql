create table board
(
    id          uuid                                not null
        primary key,
    name        varchar(100)                        not null,
    description text,
    created_at  timestamp default CURRENT_TIMESTAMP not null,
    modified_at timestamp,
    icon        varchar(50)                         not null,
    theme_color varchar(50)                         not null,
    pinned_at   timestamp
);

comment on column board.icon is '看板設定得icon';

comment on column board.theme_color is '看板主題色';

comment on column board.pinned_at is '釘選時間';

alter table board
    owner to "user";

create table labels
(
    id          uuid                                not null
        constraint tags_pkey
            primary key,
    name        varchar(50)                         not null,
    color       varchar(7)                          not null,
    created_at  timestamp default CURRENT_TIMESTAMP not null,
    modified_at timestamp,
    board_id    uuid                                not null
        constraint labels_board___fk
            references board
);

alter table labels
    owner to "user";

create table status_column
(
    id          uuid                                not null
        constraint status_column_pk
            primary key,
    title       varchar(50)                         not null,
    color       varchar(10),
    data_index  integer                             not null,
    created_at  timestamp default CURRENT_TIMESTAMP not null,
    modified_at timestamp,
    board_id    uuid                                not null
        constraint status_column_board___fk
            references board
);

comment on table status_column is '狀態欄';

comment on column status_column.title is '狀態欄的名稱';

comment on column status_column.color is '狀態欄所代表的顏色';

comment on column status_column.data_index is '狀態欄排序';

alter table status_column
    owner to "user";

create table tasks
(
    id          uuid                                not null
        constraint tasks_pk
            primary key,
    name        varchar(50)                         not null,
    data_index  integer                             not null,
    description text      default ''::text          not null,
    status_id   uuid                                not null
        constraint tasks_status_column_id_fk
            references status_column,
    created_at  timestamp default CURRENT_TIMESTAMP not null,
    modified_at timestamp,
    is_delete   boolean   default false,
    board_id    uuid                                not null
        constraint tasks_board_id_fk
            references board,
    start_date  timestamp(3),
    due_date    timestamp(3)
);

comment on column tasks.name is '任務名稱';

comment on column tasks.data_index is '任務在欄中的排序';

comment on column tasks.description is '任務描述';

comment on column tasks.status_id is '所屬';

alter table tasks
    owner to "user";

create table tasks_labels
(
    task_id  uuid not null
        references tasks,
    label_id uuid not null
        references labels,
    primary key (task_id, label_id)
);

alter table tasks_labels
    owner to "user";

create table users
(
    id          uuid                                not null
        constraint users_pk
            primary key,
    name        varchar(50)                         not null,
    email       varchar(32)                         not null
        constraint users_pk2
            unique,
    password    varchar(64)                         not null,
    avatar      bytea,
    created_at  timestamp default CURRENT_TIMESTAMP not null,
    modified_at timestamp
);

comment on table users is '使用者';

comment on column users.name is '使用者名稱';

comment on column users.avatar is '使用者照片';

comment on column users.created_at is '建立日期';

comment on column users.modified_at is '修改日期';

alter table users
    owner to "user";

create table user_board
(
    user_id  uuid        not null
        references users,
    board_id uuid        not null
        references board,
    role     varchar(50) not null,
    primary key (user_id, board_id)
);

alter table user_board
    owner to "user";

