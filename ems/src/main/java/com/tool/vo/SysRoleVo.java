package com.tool.vo;

import com.tool.model.SysResource;
import com.tool.model.SysRole;

import java.util.List;

public class SysRoleVo extends SysRole{
    private List<SysResource> roleResourceList = null;

    private String roleResources = "";

    public List<SysResource> getRoleResourceList() {
        return roleResourceList;
    }

    public void setRoleResourceList(List<SysResource> roleResourceList) {
        this.roleResourceList = roleResourceList;
    }

    public String getRoleResources() {
        return roleResources;
    }

    public void setRoleResources(String roleResources) {
        this.roleResources = roleResources;
    }
}
