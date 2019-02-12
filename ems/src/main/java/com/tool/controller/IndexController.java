package com.tool.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController extends BaseController {
	@RequestMapping(value ="/index")
	public String index(){
		return "index";
	}
	
	@RequestMapping(value = {"/welcome"})
	public String welcome(){
		return "welcome";
	}
}
