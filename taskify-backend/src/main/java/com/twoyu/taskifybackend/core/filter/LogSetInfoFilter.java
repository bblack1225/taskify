package com.twoyu.taskifybackend.core.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
public class LogSetInfoFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        String singleProcessId = UUID.randomUUID().toString();
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        MDC.put("singleProcessId", singleProcessId);
        MDC.put("reqURI", request.getRequestURI());
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
