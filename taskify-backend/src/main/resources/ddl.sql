create table status_column
(
    id          uuid                                not null
        constraint status_column_pk
            primary key,
    title       varchar(50)                         not null,
    color       varchar(10),
    "order"     integer                             not null,
    created_at  timestamp default CURRENT_TIMESTAMP not null,
    modified_at timestamp
);

comment on table status_column is '狀態欄';

comment on column status_column.title is '狀態欄的名稱';

comment on column status_column.color is '狀態欄所代表的顏色';

comment on column status_column."order" is '狀態欄排序';

alter table status_column
    owner to "user";

create table tasks
(
    id             uuid        not null
        constraint tasks_pk
            primary key,
    name           varchar(50) not null,
    "order"        integer     not null,
    "description " text,
    status_id      uuid        not null
        constraint tasks_status_column_id_fk
            references status_column
);

comment on column tasks.name is '任務名稱';

comment on column tasks."order" is '任務在欄中的排序';

comment on column tasks."description " is '任務描述';

comment on column tasks.status_id is '所屬';

alter table tasks
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
    modified_at timestamp                           not null
);

comment on table users is '使用者';

comment on column users.name is '使用者名稱';

comment on column users.avatar is '使用者照片';

comment on column users.created_at is '建立日期';

comment on column users.modified_at is '修改日期';

alter table users
    owner to "user";

create table board
(
    id          uuid                                not null
        primary key,
    name        varchar(100)                        not null,
    description text,
    created_at  timestamp default CURRENT_TIMESTAMP not null,
    modified_at timestamp
);

alter table board
    owner to "user";

create table labels
(
    id           uuid        not null
        constraint tags_pkey
            primary key,
    board_id uuid
        constraint labels_board_fk
            references workspace,
    tag_name     varchar(50) not null,
    color        varchar(7)  not null,
    created_at   timestamp default CURRENT_TIMESTAMP,
    modified_at  timestamp
);

alter table labels
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

create table user_board
(
    user_id uuid not null
        references users,
    board_id uuid not null
        references board,
    primary key (user_id, board_id)
);
