package com.twoyu.taskifybackend.service.impl;

import com.twoyu.taskifybackend.model.entity.Users;
import com.twoyu.taskifybackend.model.vo.request.CheckEmailExistRequest;
import com.twoyu.taskifybackend.model.vo.request.RegisterRequest;
import com.twoyu.taskifybackend.model.vo.response.CheckEmailExistResponse;
import com.twoyu.taskifybackend.model.vo.response.RegisterResponse;
import com.twoyu.taskifybackend.repository.UsersRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthServiceTest {

    @MockBean
    private UsersRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void test_email_exists() {
            // Arrange
            CheckEmailExistRequest request = new CheckEmailExistRequest();
            request.setEmail("test@example.com");
            Mockito.when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

            // Act
            CheckEmailExistResponse response = authService.checkEmailExist(request);

            // Assert
            assertTrue(response.isExist());
    }

    @Test
    void test_email_not_exists() {
        // Arrange
        CheckEmailExistRequest request = new CheckEmailExistRequest();
        request.setEmail("test@example.com");
        Mockito.when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);

        //Act
        CheckEmailExistResponse response = authService.checkEmailExist(request);

        // Assert
        assertFalse(response.isExist());

    }

    @Test
    void test_register_success() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setUsername("test");
        request.setPassword("test1234");

        Users savedUser = new Users();
        savedUser.setId(UUID.randomUUID());
        savedUser.setEmail(request.getEmail());
        savedUser.setName(request.getUsername());
        savedUser.setPassword(passwordEncoder.encode(request.getPassword()));

        // Act
        Mockito.when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        Mockito.when(userRepository.save(Mockito.any(Users.class))).thenReturn(savedUser);

        RegisterResponse response = authService.register(request);

        // Assert
        Mockito.verify(userRepository).save(Mockito.any(Users.class));

        assertEquals(savedUser.getEmail(), response.email());
        assertTrue(response.isSuccess());
        assertEquals("REGISTER_SUCCESS", response.message());
        // Make sure the password is encrypted
        assertNotEquals(request.getPassword(), savedUser.getPassword());


    }

    @Test
    void test_register_email_exist() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setUsername("test");
        request.setPassword("test1234");

        Users savedUser = new Users();
        savedUser.setId(UUID.randomUUID());
        savedUser.setEmail(request.getEmail());
        savedUser.setName(request.getUsername());
        savedUser.setPassword(passwordEncoder.encode(request.getPassword()));

        // Act
        Mockito.when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);
        Mockito.when(userRepository.save(Mockito.any(Users.class))).thenReturn(savedUser);

        RegisterResponse response = authService.register(request);

        // Assert
        Mockito.verify(userRepository, Mockito.never()).save(Mockito.any(Users.class));
        assertEquals(savedUser.getEmail(), response.email());
        assertFalse(response.isSuccess());
        assertEquals("EMAIL_EXIST", response.message());
    }
}