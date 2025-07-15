package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.entity.Users;
import com.twoyu.taskifybackend.model.vo.response.UserInfoResponse;
import com.twoyu.taskifybackend.repository.UsersRepository;
import com.twoyu.taskifybackend.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UsersRepository userRepository;
    @Override
    public UserInfoResponse getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ServiceException("使用者不存在"));
        return new UserInfoResponse(user.getId(), user.getName(), user.getEmail());
    }
}
