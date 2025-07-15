insert into public.users (id, name, email, password, avatar, created_at, modified_at)
values  ('5dbb8e46-9668-11ee-b9d1-0242ac120002', 'user1', 'user1@example.com', '$2a$10$bFGgEba3SUXVwd7k0cgRc.RgKqlAttnS3lq63MuA3K5E5ff2mOf8e', null, '2023-12-09 07:56:08.385573', null),
        ('38bcaefe-9668-11ee-b9d1-0242ac120002', 'Blake', 'black60137@gmail.com', '$2a$10$S74V9zmoBx859E9bESJGOeYJ5Vl./q9I4TE7UM8G1XORhWFEJYnGW', null, '2023-12-09 07:55:00.966155', null),
        ('6b4e7b18-9668-11ee-b9d1-0242ac120002', 'Keely', 'hellennnnn1@gmail.com', '$2a$10$KPDENIqtULMDa5EAwqeSGO1U0Gxk5.Bm7BbCsEIYl2jusY8DO2IwC', null, '2023-12-09 07:56:54.841804', null),
        ('e1b4e21c-478a-4091-a20c-8a4233e22ce9', 'Blakeee', 'black601372@gmail.com', '$2a$10$zFl10hXLTW4hX9sK56FDHOdHM8keolHRFl5j/dV2QEx3Rv2hzF6G.', null, '2024-01-01 18:34:34.716063', null);


insert into public.board (id, name, description, created_at, modified_at, icon, theme_color, pinned_at)
values  ('2a75796e-9ccd-11ee-8c90-0242ac120002', 'Example', 'Example Board', '2023-12-17 11:12:43.984665', null, '1f4cb', '#E8F9FD', null),
        ('1db211e4-8b1d-425c-a9dd-cbb2c20820ed', '養成習慣看板', '養成習慣', '2025-06-14 18:32:36.289140', null, '1f4cb', '#E8F9FD', null),
        ('5b59aed9-780b-4bb1-bac7-daf08c6b3209', '測試看板2', '測試一下更新看板功能', '2025-06-14 17:17:22.755856', '2025-06-14 18:36:11.668769', '1f4cb', '#E8F9FD', '2025-06-14 18:36:11.668406'),
        ('390fe884-8b98-4f06-80cc-f0fefd76c5cd', '沒事多喝水，多喝水沒事', '咕嚕咕嚕', '2025-06-14 17:49:29.683266', '2025-06-14 18:42:00.233368', '1f6b0', '#F0F4FF', null),
        ('6f5ce7e4-ec01-4080-9887-db91694deeb5', '養成習慣看板', '養成習慣', '2025-06-14 18:44:59.511016', null, '1f4cb', '#E8F9FD', null),
        ('df227f1c-9679-4897-a631-45ce5cce9c5e', '測試', '', '2025-06-16 00:49:36.834266', null, '1f636', '#E0F7FA', null),
        ('8d8aba5e-8173-462e-967f-909a506ec429', '哈囉你好嗎', '', '2025-06-16 00:52:37.247660', null, '1f38d', '#F8F3EB', null),
        ('296a0423-d062-43d7-ad2c-b5be1012af96', 'TwoYu', 'TwoYu''s board', '2023-10-22 15:19:55.227056', '2025-06-16 00:56:48.343709', '1f4cb', '#E8F9FD', '2025-06-16 00:56:48.343201'),
        ('e64f168b-4fda-4efa-a55f-0f62862a4a31', '123', '', '2025-06-16 00:56:27.302514', '2025-07-15 00:42:07.126885', '1f30f', '#E8F9FD', null),
        ('54f69b27-d2a2-40d8-8238-4c1c22f77357', '測試', '', '2025-06-16 00:50:07.932464', '2025-07-15 21:00:31.670639', '1f4af', '#E0F7FA', null),
        ('da555457-510f-4669-a05a-1da9942c2388', 'work work work', '', '2025-07-15 00:16:43.546286', '2025-07-15 21:00:34.154038', '1f9e4', '#E8F5E9', '2025-07-15 21:00:34.152929');


insert into public.labels (id, name, color, created_at, modified_at, board_id)
values  ('7ad02807-b3cf-46a4-b152-ec08a8886241', '問題', '#EBE3D5', '2023-10-24 11:45:44.322081', null, '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('c1ca37e2-752f-4cff-af58-4c8e3e703edd', '進行中測試～～～～～～～', '#87C4FF', '2023-10-24 11:45:43.659368', null, '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('c69547b1-e64d-4a71-8957-2c33991b21de', '優先', '#FFE17B', '2023-10-24 11:45:43.228521', null, '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('18b9d6ed-81bd-497f-8ab9-c71dbf5db947', '完成', '#B6E2A1', '2023-10-24 11:45:43.444733', null, '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('642db107-188a-4eee-9099-94b3bc2471fb', '註記', '#D3CEDF', '2023-10-24 11:45:43.877257', null, '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('178e0b5c-8d22-4ae2-be94-11c1e375d8e6', '審核', '#E5D4FF', '2023-10-24 11:45:44.101408', null, '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('6074f03c-ff09-441c-bc96-860de30b2077', '待處理事件好多好多好多', '#ffc091', '2023-10-24 11:45:43.013698', '2023-11-27 22:25:37.949073', '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('902a9d17-c303-4d85-8808-a461e1e0d867', '重要', '#87C4FF', '2023-10-24 11:45:42.775871', '2023-12-18 22:04:46.061395', '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('ced05bb8-26d9-40e0-9570-f9b1a03246bd', '緊急', '#b2f095', '2023-10-24 11:45:44.538644', '2024-01-16 23:04:16.875009', '296a0423-d062-43d7-ad2c-b5be1012af96');


insert into public.status_column (id, title, color, data_index, created_at, modified_at, board_id)
values  ('d2469b92-e465-4bb6-b2a7-acb71e930805', '機票一張', null, 318, '2023-11-01 17:16:02.292513', '2024-04-06 18:05:58.025818', '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('39e06e26-28e8-411f-805d-b2e3f41589ac', '222', null, 238, '2024-01-16 23:04:27.520654', '2024-04-08 13:57:00.143617', '296a0423-d062-43d7-ad2c-b5be1012af96'),
        ('9e66eca8-a2ca-48bd-9a72-710c7b1237ef', '哈囉', null, 264192, '2025-06-16 23:17:00.909715', null, '296a0423-d062-43d7-ad2c-b5be1012af96');


insert into public.tasks (id, name, data_index, description, status_id, created_at, modified_at, is_delete, board_id, start_date, due_date)
values  ('25aeb86a-f89f-451e-a4cc-7de1fad355da', 'lllz', 196608, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2024-01-13 20:11:38.812171', '2024-01-13 21:14:25.957868', false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('9d788c1d-9405-4a48-ba1f-39181f03462f', 'dsafqqqq', 131072, '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"哈哈哈哈哈"}]},{"type":"heading","attrs":{"textAlign":"left","level":3},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"YA"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"YAYA"}]}]}', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2023-12-13 23:47:02.353411', '2024-01-15 20:03:09.702792', false, '296a0423-d062-43d7-ad2c-b5be1012af96', '2023-12-14 00:00:00.000', '2023-12-23 00:00:00.000'),
        ('cc5b23f9-01e1-46a4-b395-a755a0868b01', 'qqq', 65536, '', '39e06e26-28e8-411f-805d-b2e3f41589ac', '2024-01-16 23:04:34.063530', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('c71d336e-56ec-47eb-acb8-8e6980baec8b', 'oooooo', 655360, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2024-01-22 23:29:11.154938', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('3fdf8320-f1fd-49fc-8ce6-ba064f6037c6', 'aaa', 131072, '', '39e06e26-28e8-411f-805d-b2e3f41589ac', '2024-03-24 15:40:56.556750', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('6120b3c7-1b5b-4f76-addd-6b3337d40315', 'ddd', 983040, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2024-03-25 23:32:49.593884', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('123e602c-d5ce-44e9-921a-6df3aa16b248', 'k', 1048576, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:23:25.988175', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('79e5ca40-8889-456c-900f-18ffdb277082', 'm', 1114112, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:23:26.981236', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('104825f1-1be4-48f7-af11-966a34f30746', 'k', 1179648, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:23:31.998957', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('568e9f54-bc17-4ff7-a4c8-2324a0c19d37', 'k', 1245184, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:23:33.038026', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('524d56b1-2e9d-4a71-b15a-acecae297d6b', 'k', 1310720, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:23:34.717784', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('b5294fb8-0e05-4d06-b56b-fbe9633528fc', 'k', 1376256, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:23:38.246032', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('904995e1-91cc-4589-b4f6-57571730b971', '123', 1441792, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:25:24.258777', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('a9b8b715-2965-4e89-b79e-3a9f22122e13', '123', 1507328, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:25:25.539738', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('2cb6c09e-37fe-4fd6-be53-8160292f2918', '123', 1572864, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:25:30.862324', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('69882d63-4526-4099-87e9-615d11bbd741', '123', 1638400, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:25:31.479378', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('724e2483-b7f5-4677-bb23-d7ec3707cd4e', '123', 1703936, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 21:25:32.859215', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null),
        ('7a065766-ab88-45cc-b7f5-2186294b4518', 'sdddd', 1769472, '', 'd2469b92-e465-4bb6-b2a7-acb71e930805', '2025-07-15 22:17:47.335012', null, false, '296a0423-d062-43d7-ad2c-b5be1012af96', null, null);


insert into public.tasks_labels (task_id, label_id)
values  ('25aeb86a-f89f-451e-a4cc-7de1fad355da', 'ced05bb8-26d9-40e0-9570-f9b1a03246bd'),
        ('25aeb86a-f89f-451e-a4cc-7de1fad355da', '7ad02807-b3cf-46a4-b152-ec08a8886241'),
        ('25aeb86a-f89f-451e-a4cc-7de1fad355da', 'c1ca37e2-752f-4cff-af58-4c8e3e703edd'),
        ('9d788c1d-9405-4a48-ba1f-39181f03462f', '642db107-188a-4eee-9099-94b3bc2471fb'),
        ('25aeb86a-f89f-451e-a4cc-7de1fad355da', 'c69547b1-e64d-4a71-8957-2c33991b21de'),
        ('9d788c1d-9405-4a48-ba1f-39181f03462f', '7ad02807-b3cf-46a4-b152-ec08a8886241'),
        ('9d788c1d-9405-4a48-ba1f-39181f03462f', 'ced05bb8-26d9-40e0-9570-f9b1a03246bd');


insert into public.user_board (user_id, board_id, role)
values  ('38bcaefe-9668-11ee-b9d1-0242ac120002', '296a0423-d062-43d7-ad2c-b5be1012af96', 'OWNER'),
        ('6b4e7b18-9668-11ee-b9d1-0242ac120002', '296a0423-d062-43d7-ad2c-b5be1012af96', 'ADMIN'),
        ('38bcaefe-9668-11ee-b9d1-0242ac120002', '5b59aed9-780b-4bb1-bac7-daf08c6b3209', 'OWNER'),
        ('6b4e7b18-9668-11ee-b9d1-0242ac120002', '390fe884-8b98-4f06-80cc-f0fefd76c5cd', 'OWNER'),
        ('38bcaefe-9668-11ee-b9d1-0242ac120002', '1db211e4-8b1d-425c-a9dd-cbb2c20820ed', 'OWNER'),
        ('6b4e7b18-9668-11ee-b9d1-0242ac120002', 'df227f1c-9679-4897-a631-45ce5cce9c5e', 'OWNER'),
        ('6b4e7b18-9668-11ee-b9d1-0242ac120002', '54f69b27-d2a2-40d8-8238-4c1c22f77357', 'OWNER'),
        ('6b4e7b18-9668-11ee-b9d1-0242ac120002', '8d8aba5e-8173-462e-967f-909a506ec429', 'OWNER'),
        ('6b4e7b18-9668-11ee-b9d1-0242ac120002', 'e64f168b-4fda-4efa-a55f-0f62862a4a31', 'OWNER'),
        ('6b4e7b18-9668-11ee-b9d1-0242ac120002', 'da555457-510f-4669-a05a-1da9942c2388', 'OWNER');