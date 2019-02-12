package com.tool.controller.system;

import com.tool.common.ResultCode;
import com.tool.common.utils.ObjectUtils;
import com.tool.common.utils.ResultGenerator;
import com.tool.common.utils.StringUtils;
import com.tool.model.SysResource;
import com.tool.service.IResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/system/resource")
public class ResourceController {

	@Autowired
	private IResourceService resourceService;

	@GetMapping("/manager")
	public String manager() {
		return "system/resource";
	}

	@GetMapping("/getResourceList")
	@ResponseBody
	public Map<String,Object> getResourceList(@RequestParam Map<String, Object> params) {
		String resourceIds = ObjectUtils.toString(params.get("resourceIds"));
		String resourceName = ObjectUtils.toString(params.get("resourceName"));
		Integer resourceType = ObjectUtils.toInteger(params.get("resourceType"));
		Long parentId = ObjectUtils.toLong(params.get("parentId"));
		Integer start = ObjectUtils.toInteger(params.get("start"));
		Integer limit = ObjectUtils.toInteger(params.get("limit"));
		String sort = ObjectUtils.toString(params.get("sort"));
		String order = ObjectUtils.toString(params.get("order"));

		Map<String,Object> reqParam = new HashMap<>();
		if (StringUtils.isNotEmpty(resourceIds)){
			reqParam.put("resourceIdAry",resourceIds.split(","));
		}
		if (StringUtils.isNotEmpty(resourceName)){
			reqParam.put("resourceName",resourceName);
		}
		if (ObjectUtils.isNotNull(resourceType)){
			reqParam.put("resourceType",resourceType);
		}
		if (ObjectUtils.isNotNull(parentId)){
			reqParam.put("parentId",parentId);
		}
		if (ObjectUtils.isNotNull(start) && ObjectUtils.isNotNull(limit)){
			reqParam.put("start",start);
			reqParam.put("limit",limit);
		}
		if (StringUtils.isNotEmpty(sort) && StringUtils.isNotEmpty(order)){
			reqParam.put("sort",sort);
			reqParam.put("order",order);
		}

		Integer total = resourceService.getResourceCount(reqParam);
		List<SysResource> sysResourceList = new ArrayList<>();
		if (total>0){
			sysResourceList = resourceService.getResourceList(reqParam);
		}

		Map<String,Object> resultMap= ResultGenerator.getSuccessMap();
		resultMap.put("total", total);
		resultMap.put("rows", sysResourceList);
		return resultMap;
	}

	@GetMapping("/getResourceDetail")
	@ResponseBody
	public Map<String,Object> getResourceDetail(Long id) {
		SysResource sysResource = resourceService.getResourceDetail(id);

		if (ObjectUtils.isNull(sysResource)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),"数据为空！");
		}

		Map<String,Object> result = ResultGenerator.getSuccessMap();
		result.put("data", sysResource);
		return result;
	}

	@PostMapping("/saveResource")
	@ResponseBody
	public Map<String,Object> saveResource(SysResource sysResource) {
		String errMsg= resourceService.saveResource(sysResource);
		if (StringUtils.isNotEmpty(errMsg)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),errMsg);
		}

		return ResultGenerator.getSuccessMap();
	}

	@GetMapping("/getSysResourceTree")
	@ResponseBody
	public Map<String,Object> getSysResourceTree(){
		List<SysResource> resourceListTree = resourceService.getAllResourceList();
		Map<String,Object> result = ResultGenerator.getSuccessMap();
		result.put("data",resourceListTree);
		return result;
	}
}
