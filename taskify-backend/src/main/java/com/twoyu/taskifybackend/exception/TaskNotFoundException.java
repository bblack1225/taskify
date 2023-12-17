package com.twoyu.taskifybackend.exception;

public class TaskNotFoundException extends ServiceException{
    public TaskNotFoundException() {
        super("Task not found");
    }
}
