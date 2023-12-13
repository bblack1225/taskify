package com.twoyu.taskifybackend.util;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class DateUtils {


    public static LocalDateTime dateStrToLocalDateTime(String dateStr){
        if(dateStr == null || dateStr.trim().isEmpty()){
            return null;
        }
        LocalDate localDate = LocalDate.parse(dateStr);
        return LocalDateTime.of(localDate, LocalTime.MIDNIGHT);
    }
}
