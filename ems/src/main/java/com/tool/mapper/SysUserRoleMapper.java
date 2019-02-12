package com.tool.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface SysUserRoleMapper {
    Integer deleteUserRoleBatch(Map<String,Object> param);

    Integer addUserRole(@Param("userId") Long userId, @Param("roleId") Long roleId);
}