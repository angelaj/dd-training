package com.tool.controller;

import com.tool.model.SysResource;
import com.tool.model.SysUser;
import com.tool.service.IResourceService;
import com.tool.service.IUserService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class LoginController extends BaseController {
	@Autowired
	IUserService userService;

	@Autowired
	IResourceService resourceService;

	@RequestMapping(value = { "/login" }, method = RequestMethod.GET)
	public String login() {
		return "login";
	}

	@RequestMapping(value = { "/login" }, method = RequestMethod.POST)
	public String login(@RequestParam("loginName") String loginName,@RequestParam("password") String password,ModelMap model) {
		try {
			 Subject subject = SecurityUtils.getSubject();
			 UsernamePasswordToken token = new UsernamePasswordToken(loginName, password);
			subject.login(token);
			//获取当前登录用户
			SysUser sysUser = userService.findByLoginName(token.getUsername());
			//获取用戶所有权限
			List<SysResource> resourceTree = resourceService.getResourceTreeByUserId(sysUser.getId());
			Session session = subject.getSession();
			session.setAttribute("currentUser", sysUser);
			session.setAttribute("resourceTree", resourceTree);
			return redirect("index");
		} catch (AuthenticationException e) {
			model.put("message", e.getMessage());
		}
		return "login";
	}
	
	@RequestMapping(value = { "/logout" }, method = RequestMethod.GET)
	public String logout() {
		Subject subject = SecurityUtils.getSubject();
		subject.logout();
		return redirect("login");
	}
	
}
