package com.tool.common.utils;

import com.tool.common.ResultCode;

import java.util.HashMap;
import java.util.Map;

public class ResultGenerator {
    public static Map<String,Object> getSuccessMap(){
        Map<String,Object> result = new HashMap<>();
        result.put("rsCode", ResultCode.CODE_SUCCESS.getCode());
        result.put("rsMsg", ResultCode.CODE_SUCCESS.getMessage());
        return result;
    }

    public static Map<String,Object> getFailMap(String code, String message){
        Map<String,Object> result = new HashMap<>();
        result.put("rsCode", code);
        result.put("rsMsg", message);
        return result;
    }

    public static Map<String,Object> getFailMap(){
        Map<String,Object> result = new HashMap<>();
        result.put("rsCode", ResultCode.CODE_FAIL.getCode());
        result.put("rsMsg", ResultCode.CODE_FAIL.getMessage());
        return result;
    }

}
