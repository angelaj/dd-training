package com.tool.controller.system;

import com.tool.common.ResultCode;
import com.tool.common.utils.ObjectUtils;
import com.tool.common.utils.ResultGenerator;
import com.tool.common.utils.StringUtils;
import com.tool.model.SysRole;
import com.tool.service.IResourceService;
import com.tool.service.IRoleService;
import com.tool.vo.SysRoleVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/system/role")
public class RoleController {

	@Autowired
	private IRoleService roleService;

	@Autowired
	private IResourceService resourceService;

	@GetMapping("/manager")
	public String manager() {
		return "system/role";
	}

	@GetMapping("/getRoleList")
	@ResponseBody
	public Map<String,Object> getRoleList(@RequestParam Map<String, Object> params) {
		String roleIds = ObjectUtils.toString(params.get("roleIds"));
		Integer roleType = ObjectUtils.toInteger(params.get("roleType"));
		String roleName = ObjectUtils.toString(params.get("roleName"));
		Integer start = ObjectUtils.toInteger(params.get("start"));
		Integer limit = ObjectUtils.toInteger(params.get("limit"));
		String sort = ObjectUtils.toString(params.get("sort"));
		String order = ObjectUtils.toString(params.get("order"));

		Map<String,Object> reqParam = new HashMap<>();
		if (StringUtils.isNotEmpty(roleIds)){
			reqParam.put("roleIdAry",roleIds.split(","));
		}
		if (ObjectUtils.isNotNull(roleType)){
			reqParam.put("roleType",roleType);
		}
		if (StringUtils.isNotEmpty(roleName)){
			reqParam.put("roleName",roleName);
		}
		if (ObjectUtils.isNotNull(start) && ObjectUtils.isNotNull(limit)){
			reqParam.put("start",start);
			reqParam.put("limit",limit);
		}
		if (StringUtils.isNotEmpty(sort) && StringUtils.isNotEmpty(order)){
			reqParam.put("sort",sort);
			reqParam.put("order",order);
		}

		Integer total = roleService.getRoleCount(reqParam);
		List<SysRole> sysRoleList = new ArrayList<>();
		if (total>0){
			sysRoleList = roleService.getRoleList(reqParam);
		}

		Map<String,Object> resultMap= ResultGenerator.getSuccessMap();
		resultMap.put("total", total);
		resultMap.put("rows", sysRoleList);
		return resultMap;
	}

	@GetMapping("/getRoleDetail")
	@ResponseBody
	public Map<String,Object> getRoleDetail(Long id) {
		SysRoleVo sysRoleVo = roleService.getRoleDetail(id);

		if (ObjectUtils.isNull(sysRoleVo)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),"数据为空！");
		}

		Map<String,Object> result = ResultGenerator.getSuccessMap();
		result.put("data", sysRoleVo);
		return result;
	}

	@PostMapping("/saveRole")
	@ResponseBody
	public Map<String,Object> saveRole(SysRoleVo sysRoleVo) {
		String errMsg= roleService.saveRole(sysRoleVo);
		if (StringUtils.isNotEmpty(errMsg)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),errMsg);
		}

		return ResultGenerator.getSuccessMap();
	}

}
