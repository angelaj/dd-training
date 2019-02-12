package com.tool.service.impl;

import com.tool.common.utils.TreeUtils;
import com.tool.mapper.SysResourceMapper;
import com.tool.model.SysResource;
import com.tool.service.IResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResourceServiceImpl implements IResourceService {
    @Autowired
    SysResourceMapper sysResourceMapper;

    @Override
    public Integer getResourceCountByUser(Map<String,Object> reqParams) {
        return sysResourceMapper.getResourceCountByUser(reqParams);
    }

    @Override
    public List<SysResource> getResourceListByUser(Map<String,Object> reqParams) {
        return sysResourceMapper.getResourceListByUser(reqParams);
    }

    @Override
    public List<SysResource> getResourceTreeByUserId(Long userId) {
        String resourceTypes="0,1";
        Map<String,Object> reqParams = new HashMap<>();
        reqParams.put("userId", userId);
        reqParams.put("resourceTypeAry", resourceTypes.split(","));
        List<SysResource> resourceList = sysResourceMapper.getResourceListByUser(reqParams);
        return TreeUtils.getChildPerms(resourceList, 0);
    }

    @Override
    public List<SysResource> getAllResourceList() {
        List<SysResource> resourceList = sysResourceMapper.getResourceListByResource(null);
        return resourceList;
    }

    @Override
    public Integer getResourceCountByRole(Map<String, Object> reqParams) {
        return sysResourceMapper.getResourceCountByRole(reqParams);
    }

    @Override
    public List<SysResource> getResourceListByRole(Map<String, Object> reqParams) {
        return sysResourceMapper.getResourceListByRole(reqParams);
    }

    @Override
    public Integer getResourceCount(Map<String, Object> reqParams) {
        return sysResourceMapper.getResourceCountByResource(reqParams);
    }

    @Override
    public List<SysResource> getResourceList(Map<String, Object> reqParams) {
        return sysResourceMapper.getResourceListByResource(reqParams);
    }

    @Override
    public SysResource getResourceDetail(Long resourceId) {
        return sysResourceMapper.getById(resourceId);
    }

    @Transactional
    @Override
    public String saveResource(SysResource sysResource) {
        Long resouceId = sysResource.getId();
        //新增或更新用户信息
        if (resouceId == null){//新增
            sysResource.setCreateTime(new Date());
            sysResource.setUpdateTime(new Date());
            sysResourceMapper.insertResource(sysResource);
        }else {
            sysResource.setUpdateTime(new Date());
            sysResourceMapper.updateResource(sysResource);
        }

        return "";
    }
}
