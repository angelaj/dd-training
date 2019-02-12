package com.tool.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

@Mapper
public interface SysRoleResourceMapper {
    Integer deleteRoleResourceBatch(Map<String,Object> param);

    Integer addRoleResource(@Param("roleId") Long roleId, @Param("resourceId") Long resourceId);
}