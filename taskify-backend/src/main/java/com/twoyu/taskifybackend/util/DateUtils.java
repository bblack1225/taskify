package com.twoyu.taskifybackend.util;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    private DateUtils(){}

    public static LocalDateTime dateStrToLocalDateTime(String dateStr){
        if(dateStr == null || dateStr.trim().isEmpty()){
            return null;
        }
        LocalDate localDate = LocalDate.parse(dateStr);
        return LocalDateTime.of(localDate, LocalTime.MIDNIGHT);
    }

    public static String dateToDateStr(LocalDateTime localDateTime){
        if(localDateTime == null){
            return null;
        }
        return localDateTime.format(DATE_TIME_FORMATTER);
    }
}
