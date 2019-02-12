package com.tool.config.shiro;

import com.tool.common.utils.MD5Utils;
import com.tool.model.SysResource;
import com.tool.model.SysRole;
import com.tool.model.SysUser;
import com.tool.service.IResourceService;
import com.tool.service.IRoleService;
import com.tool.service.IUserService;
import org.apache.shiro.authc.*;
import org.apache.shiro.authc.credential.AllowAllCredentialsMatcher;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class MyRealm extends AuthorizingRealm {
	@Autowired
	private IUserService userService;

	@Autowired
	private IRoleService roleService;

	@Autowired
	private IResourceService resourceService;

	public MyRealm(){
		super(new AllowAllCredentialsMatcher());
        setAuthenticationTokenClass(UsernamePasswordToken.class);

        //FIXME: 暂时禁用Cache
        setCachingEnabled(false);
	}

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		SysUser user = (SysUser) principals.getPrimaryPrincipal();
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		SysUser dbUser = userService.findByLoginName(user.getLoginName());
		Set<String> shiroPermissions = new HashSet<>();
		Set<String> roleSet = new HashSet<String>();
		Map<String,Object> param = new HashMap<>();
		param.put("userId",dbUser.getId());
		List<SysRole> roleList = roleService.getRoleListByUser(param);
		if (roleList != null && roleList.size() > 0) {
			for (SysRole role : roleList) {
				param = new HashMap<>();
				param.put("roleId",role.getId());
				List<SysResource> resourceList = resourceService.getResourceListByRole(param);
				if (resourceList != null && resourceList.size() > 0) {
					for (SysResource resource : resourceList) {
						shiroPermissions.add(resource.getResourceCode());
					}
				}
				roleSet.add(role.getRoleKey());
			}
		}
		authorizationInfo.setRoles(roleSet);
		authorizationInfo.setStringPermissions(shiroPermissions);
		return authorizationInfo;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(
			AuthenticationToken token) throws AuthenticationException {
		String loginName = (String) token.getPrincipal();
		String password = new String((char[]) token.getCredentials());
		SysUser user = userService.findByLoginName(loginName);

		// 账号不存在
		if (user == null) {
			throw new UnknownAccountException("账号不存在");
		}

		// 密码错误
		if (!MD5Utils.md5(password).equals(user.getPassword())) {
			throw new IncorrectCredentialsException("账号或密码不正确");
		}

		SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(user, password, getName());
		return info;
	}

}
