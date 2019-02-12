package com.tool.config.aop;

import com.alibaba.fastjson.JSONObject;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Aspect
@Component
public class WebLogAcpect {
    private Logger logger = LoggerFactory.getLogger(WebLogAcpect.class);

    /**
     * 定义切入点
     */
    @Pointcut("execution(public * com.tool.controller..*.*(..))")
    public void webLog(){}

    @Around("webLog()")
    public Object doAroundAdvice(ProceedingJoinPoint proceedingJoinPoint){
        JoinPoint joinPoint = proceedingJoinPoint;

        // 接收到请求，记录请求内容
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        HttpSession session = request.getSession();
        String sessioId = session.getId();

        String url = request.getRequestURL().toString();
        String method = request.getMethod();
        String ip=request.getRemoteAddr();
        String uri = request.getRequestURI();
        String classMethod = joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName();
        String queryString = request.getQueryString();
        Object[] args = joinPoint.getArgs();
        String params = "";
        //获取请求参数集合并进行遍历拼接
        if(args!=null && args.length>0){
            if("POST".equals(method)){
                params = JSONObject.toJSONString(args);
            }else if("GET".equals(method)){
                params = queryString;
            }
        }

        logger.info("request-info: session_id={"+sessioId+"}, url={" + url+"}, http_method={"+method+"}, ip={"+ip+"}, uri={"+uri+"}, class_method={"
                +classMethod+"}, params={"+params+"}");
        Long startTime = System.currentTimeMillis();
        try {
            Object obj = proceedingJoinPoint.proceed();
            Long endTime = System.currentTimeMillis();
            logger.info("response-info: session_id={" + sessioId+"}, spend-time={"+(endTime-startTime)+"ms}");
            return obj;
        } catch (Throwable exception) {
            exception.printStackTrace();
            logger.info("request-info: session_id={"+sessioId+", url={" + url+"}, http_method={"+method+"}, ip={"+ip+"}, uri={"+uri+"}, class_method={"+classMethod
                    +"}, params={"+params+"}, error-info={"+ exception.toString()+"}");
        }
        return null;
    }
}
