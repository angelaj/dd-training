package com.tool.service;

import com.tool.model.SysResource;

import java.util.List;
import java.util.Map;

public interface IResourceService{
    Integer getResourceCountByUser(Map<String,Object> reqParams);

    List<SysResource> getResourceListByUser(Map<String,Object> reqParams);

    List<SysResource> getResourceTreeByUserId(Long userId);

    List<SysResource> getAllResourceList();

    Integer getResourceCountByRole(Map<String,Object> reqParams);

    List<SysResource> getResourceListByRole(Map<String,Object> reqParams);

    Integer getResourceCount(Map<String,Object> reqParams);

    List<SysResource> getResourceList(Map<String,Object> reqParams);

    SysResource getResourceDetail(Long resourceId);

    String saveResource(SysResource sysResource);
}
