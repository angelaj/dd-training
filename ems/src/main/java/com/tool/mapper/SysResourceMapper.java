package com.tool.mapper;

import com.tool.model.SysResource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface SysResourceMapper {
    Integer getResourceCountByRole(Map<String,Object> reqParams);

    List<SysResource> getResourceListByRole(Map<String,Object> reqParams);

    Integer getResourceCountByUser(Map<String,Object> reqParams);

    List<SysResource> getResourceListByUser(Map<String,Object> reqParams);

    Integer getResourceCountByResource(Map<String,Object> reqParams);

    List<SysResource> getResourceListByResource(Map<String,Object> reqParams);

    SysResource getById(@Param("id") Long id);

    Integer insertResource(SysResource sysResource);

    Integer updateResource(SysResource sysResource);
}