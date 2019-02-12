package com.tool.controller.system;

import com.tool.common.ResultCode;
import com.tool.common.utils.ObjectUtils;
import com.tool.common.utils.ResultGenerator;
import com.tool.common.utils.StringUtils;
import com.tool.model.SysUser;
import com.tool.service.IRoleService;
import com.tool.service.IUserService;
import com.tool.vo.SysUserVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/system/user")
public class UserController {

	@Autowired
	private IUserService userService;

	@Autowired
	private IRoleService roleService;

	@GetMapping("/manager")
	public String manager() {
		return "system/user";
	}

	@GetMapping("/getUserList")
	@ResponseBody
	public Map<String,Object> getUserList(@RequestParam Map<String, Object> params) {
		Long userId = ObjectUtils.toLong(params.get("userId"));
		String userIds = ObjectUtils.toString(params.get("userIds"));
		String loginName = ObjectUtils.toString(params.get("loginName"));
		String userName = ObjectUtils.toString(params.get("userName"));
		Long roleId = ObjectUtils.toLong(params.get("roleId"));
		Integer state = ObjectUtils.toInteger(params.get("state"));
		Integer start = ObjectUtils.toInteger(params.get("start"));
		Integer limit = ObjectUtils.toInteger(params.get("limit"));
		String sort = ObjectUtils.toString(params.get("sort"));
		String order = ObjectUtils.toString(params.get("order"));

		Map<String,Object> reqParam = new HashMap<>();
		if (ObjectUtils.isNotNull(userId)){
			reqParam.put("userId",userId);
		}
		if (StringUtils.isNotEmpty(userIds)){
			reqParam.put("userIdAry",userIds.split(","));
		}
		if (StringUtils.isNotEmpty(loginName)){
			reqParam.put("loginName",loginName);
		}
		if (StringUtils.isNotEmpty(userName)){
			reqParam.put("userName",userName);
		}
		if (ObjectUtils.isNotNull(roleId)){
			reqParam.put("roleId",roleId);
		}
		if (ObjectUtils.isNotNull(state)){
			reqParam.put("state",state);
		}
		if (ObjectUtils.isNotNull(start) && ObjectUtils.isNotNull(limit)){
			reqParam.put("start",start);
			reqParam.put("limit",limit);
		}
		if (StringUtils.isNotEmpty(sort) && StringUtils.isNotEmpty(order)){
			reqParam.put("sort",sort);
			reqParam.put("order",order);
		}
		Integer total = userService.getUserCountByRole(reqParam);
		List<SysUser> sysUserList = new ArrayList<>();
		if (total>0){
			sysUserList = userService.getUserListByRole(reqParam);
		}

		Map<String,Object> resultMap= ResultGenerator.getSuccessMap();
		resultMap.put("total", total);
		resultMap.put("rows", sysUserList);
		return resultMap;
	}

	@GetMapping("/updateUserStatusBatch")
	@ResponseBody
	public Map<String,Object> updateUserStatusBatch(@RequestParam Map<String, Object> params) {
		String userIdAry = ObjectUtils.toString(params.get("userIdAry"));
		Integer state = ObjectUtils.toInteger(params.get("state"));
		if (StringUtils.isEmpty(userIdAry)|| ObjectUtils.isNull(state)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),"参数不能为空！");
		}

		Map<String,Object> reqParam = new HashMap<>();
		reqParam.put("userIdAry",userIdAry.split(","));
		reqParam.put("toState",state);
		String errMsg = userService.updateUserByMap(reqParam);
		if (StringUtils.isNotEmpty(errMsg)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),errMsg);
		}

		return ResultGenerator.getSuccessMap();
	}

	@GetMapping("/getUserDetail")
	@ResponseBody
	public Map<String,Object> getUserDetail(Long id) {
		SysUserVo sysUserVo = userService.getUserDetail(id);

		if (ObjectUtils.isNull(sysUserVo)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),"数据为空！");
		}

		Map<String,Object> result = ResultGenerator.getSuccessMap();
		result.put("data", sysUserVo);
		return result;
	}

	@PostMapping("/saveUser")
	@ResponseBody
	public Map<String,Object> saveUser(SysUserVo sysUserVo) {
		String errMsg= userService.saveUser(sysUserVo);
		if (StringUtils.isNotEmpty(errMsg)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),errMsg);
		}

		return ResultGenerator.getSuccessMap();
	}

	@GetMapping("/checkUserIsExist")
	@ResponseBody
	public Map<String,Object> checkUserIsExist(@RequestParam String loginName) {
		boolean isExist = true;
		SysUser sysUser= userService.findByLoginName(loginName);
		if (ObjectUtils.isNull(sysUser)){
			isExist = false;
		}

		Map<String,Object> result = ResultGenerator.getSuccessMap();
		result.put("data",isExist);
		return result;
	}
}
