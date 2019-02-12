package com.tool.common;

public enum ResultCode {
    CODE_SUCCESS("A000000","成功"),
    CODE_FAIL("A000001","失败");

    String code;
    String message;

    ResultCode(String code, String message){
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
