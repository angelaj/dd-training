package com.tool.vo;

import com.tool.model.SysRole;
import com.tool.model.SysUser;

import java.util.List;

public class SysUserVo extends SysUser{
    private List<SysRole> userRoleList = null;

    private String userRoles = null;

    public List<SysRole> getUserRoleList() {
        return userRoleList;
    }

    public void setUserRoleList(List<SysRole> userRoleList) {
        this.userRoleList = userRoleList;
    }

    public String getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(String userRoles) {
        this.userRoles = userRoles;
    }
}
