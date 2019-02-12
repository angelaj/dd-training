package com.tool.mapper;

import com.tool.model.SysRole;
import com.tool.vo.SysRoleVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface SysRoleMapper {
    Integer getRoleCountByUser(Map<String,Object> param);

    List<SysRole> getRoleListByUser(Map<String,Object> param);

    Integer getRoleCount(Map<String,Object> params);

    List<SysRole> getRoleList(Map<String,Object> params);

    SysRoleVo getRoleById(@Param("id") Long id);

    Integer insertRole(SysRoleVo sysRoleVo);

    Integer updateRole(SysRoleVo sysRoleVo);
}