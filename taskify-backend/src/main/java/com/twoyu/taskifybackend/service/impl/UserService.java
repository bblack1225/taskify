package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.exception.ServiceException;
import com.twoyu.taskifybackend.model.entity.Board;
import com.twoyu.taskifybackend.model.entity.UserBoard;
import com.twoyu.taskifybackend.model.entity.Users;
import com.twoyu.taskifybackend.model.vo.response.UserInfoResponse;
import com.twoyu.taskifybackend.repository.BoardRepository;
import com.twoyu.taskifybackend.repository.UserBoardRepository;
import com.twoyu.taskifybackend.repository.UsersRepository;
import com.twoyu.taskifybackend.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UsersRepository userRepository;
    private final UserBoardRepository userBoardRepository;
    private final BoardRepository boardRepository;
    @Override
    public UserInfoResponse getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ServiceException("使用者不存在"));
        List<UserBoard> userBoards = userBoardRepository.findByIdUserId(user.getId());
        if(userBoards.isEmpty()){
            throw new ServiceException("使用者沒有任何看板");
        }
        // 先取得第一個boardId
        UserBoard userBoard = userBoards.get(0);
        Board board = boardRepository.findById(userBoard.getId().getBoardId())
                .orElseThrow(() -> new ServiceException("查無看板"));
        return new UserInfoResponse(user.getId(), user.getName(), user.getEmail(), board.getId(), board.getName());
    }
}
