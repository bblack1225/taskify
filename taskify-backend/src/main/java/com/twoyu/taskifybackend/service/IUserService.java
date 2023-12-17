package com.twoyu.taskifybackend.service;

import com.twoyu.taskifybackend.model.vo.response.UserInfoResponse;

import java.util.UUID;

public interface IUserService {
    UserInfoResponse getUserInfo();
}
