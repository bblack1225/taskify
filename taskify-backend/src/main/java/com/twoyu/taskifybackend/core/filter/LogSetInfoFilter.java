package com.twoyu.taskifybackend.core.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
public class LogSetInfoFilter implements Filter {
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        String singleProcessId = UUID.randomUUID().toString();
//        MDC.put("singleProcessId", singleProcessId);
//        MDC.put("reqURI", request.getRequestURI());
//        filterChain.doFilter(request, response);
//    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        String singleProcessId = UUID.randomUUID().toString();
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        MDC.put("singleProcessId", singleProcessId);
        MDC.put("reqURI", request.getRequestURI());
        log.info("reqURI: {}", request.getRequestURI());
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
