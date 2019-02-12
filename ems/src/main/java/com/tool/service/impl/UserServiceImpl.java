package com.tool.service.impl;

import com.tool.common.utils.MD5Utils;
import com.tool.common.utils.RandomUtils;
import com.tool.common.utils.StringUtils;
import com.tool.mapper.SysUserMapper;
import com.tool.mapper.SysUserRoleMapper;
import com.tool.model.SysRole;
import com.tool.model.SysUser;
import com.tool.service.IRoleService;
import com.tool.service.IUserService;
import com.tool.vo.SysUserVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class UserServiceImpl implements IUserService {
	@Autowired
	SysUserMapper sysUserMapper;

	@Autowired
	SysUserRoleMapper sysUserRoleMapper;

	@Autowired
	IRoleService roleService;

	@Override
	public SysUser findByLoginName(String userName) {
		return sysUserMapper.findByLoginName(userName);
	}

	@Override
	public Integer getUserCountByRole(Map<String, Object> param) {
		return sysUserMapper.getUserCountByRole(param);
	}

	@Override
	public List<SysUser> getUserListByRole(Map<String, Object> param) {
		return sysUserMapper.getUserListByRole(param);
	}

	@Override
	public String updateUserByMap(Map<String, Object> param) {
		Integer total = sysUserMapper.updateUserByMap(param);
		if (total==0){
			return "更新用户记录失败！";
		}
		return "";
	}

	@Override
	public SysUserVo getUserDetail(Long userId) {
		SysUserVo sysUserVo = sysUserMapper.getUserById(userId);
		if (sysUserVo != null){
			Map<String,Object> param = new HashMap<>();
			param.put("userId",userId);
			List<SysRole> sysRoleList = roleService.getRoleListByUser(param);
			sysUserVo.setUserRoleList(sysRoleList);
		}
		return sysUserVo;
	}

	@Transactional
	@Override
	public String saveUser(SysUserVo sysUserVo) {
		Long userId = sysUserVo.getId();
		//新增或更新用户信息
		if (userId == null){//新增
			String randStr = RandomUtils.getRandomChar(6);
			String password = MD5Utils.md5(randStr);
			sysUserVo.setPassword(password);
			sysUserVo.setState(0);
			sysUserVo.setCreateTime(new Date());
			sysUserVo.setUpdateTime(new Date());
			sysUserMapper.insertUser(sysUserVo);
			userId=sysUserVo.getId();
		}else {
			sysUserVo.setUpdateTime(new Date());
			sysUserMapper.updateUser(sysUserVo);
		}

		Map<String,Object> param = new HashMap<>();
		param.put("userId",sysUserVo.getId());
		sysUserRoleMapper.deleteUserRoleBatch(param);

		if (StringUtils.isNotEmpty(sysUserVo.getUserRoles())){
			String[] userRoleIdAry = sysUserVo.getUserRoles().split(",");
			for (String userRoleId: userRoleIdAry){
				Long roleId = Long.parseLong(userRoleId);
				sysUserRoleMapper.addUserRole(userId,roleId);
			}
		}

		return "";
	}
}
