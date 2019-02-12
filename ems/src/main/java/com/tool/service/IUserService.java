package com.tool.service;

import com.tool.model.SysUser;
import com.tool.vo.SysUserVo;

import java.util.List;
import java.util.Map;

public interface IUserService{
	SysUser findByLoginName(String userName);

	Integer getUserCountByRole(Map<String,Object> param);

	List<SysUser> getUserListByRole(Map<String,Object> param);

	String updateUserByMap(Map<String,Object> param);

	SysUserVo getUserDetail(Long userId);

	String saveUser(SysUserVo sysUserVo);
}
