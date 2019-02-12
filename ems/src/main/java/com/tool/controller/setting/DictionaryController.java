package com.tool.controller.setting;

import com.tool.common.ResultCode;
import com.tool.common.utils.ObjectUtils;
import com.tool.common.utils.ResultGenerator;
import com.tool.common.utils.StringUtils;
import com.tool.model.Dictionary;
import com.tool.service.IDictionaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/setting/dictionary")
public class DictionaryController {

	@Autowired
	private IDictionaryService dictionaryService;

	@GetMapping("/manager")
	public String manager() {
		return "setting/dictionary";
	}

	@GetMapping("/getDicCodeList")
	@ResponseBody
	public Map<String,Object> getDicCodeList(@RequestParam Map<String, Object> params) {
		String dicCodes = ObjectUtils.toString(params.get("dicCodes"));
		Integer start = ObjectUtils.toInteger(params.get("start"));
		Integer limit = ObjectUtils.toInteger(params.get("limit"));
		String sort = ObjectUtils.toString(params.get("sort"));
		String order = ObjectUtils.toString(params.get("order"));

		Map<String,Object> reqParam = new HashMap<>();
		if (StringUtils.isNotEmpty(dicCodes)){
			reqParam.put("dicCodeAry",dicCodes.split(","));
		}
		if (ObjectUtils.isNotNull(start) && ObjectUtils.isNotNull(limit)){
			reqParam.put("start",start);
			reqParam.put("limit",limit);
		}
		if (StringUtils.isNotEmpty(sort) && StringUtils.isNotEmpty(order)){
			reqParam.put("sort",sort);
			reqParam.put("order",order);
		}
		Integer total = dictionaryService.getDicCodeCount(reqParam);
		List<String> dicCodeList = new ArrayList<>();
		if (total>0){
			dicCodeList = dictionaryService.getDicCodeList(reqParam);
		}

		Map<String,Object> resultMap= ResultGenerator.getSuccessMap();
		resultMap.put("total", total);
		resultMap.put("rows", dicCodeList);
		return resultMap;
	}

	@GetMapping("/getDictionaryList")
	@ResponseBody
	public Map<String,Object> getDictionaryList(@RequestParam Map<String, Object> params) {
		String dicCode = ObjectUtils.toString(params.get("dicCode"));
		String dictionaryIds = ObjectUtils.toString(params.get("dictionaryIds"));
		String itemName = ObjectUtils.toString(params.get("itemName"));
		Integer itemValue = ObjectUtils.toInteger(params.get("itemValue"));
		Integer start = ObjectUtils.toInteger(params.get("start"));
		Integer limit = ObjectUtils.toInteger(params.get("limit"));
		String sort = ObjectUtils.toString(params.get("sort"));
		String order = ObjectUtils.toString(params.get("order"));

		Map<String,Object> reqParam = new HashMap<>();
		if (StringUtils.isNotEmpty(dicCode)){
			reqParam.put("dicCode",dicCode);
		}
		if (StringUtils.isNotEmpty(dictionaryIds)){
			reqParam.put("dictionaryIdAry",dictionaryIds.split(","));
		}
		if (StringUtils.isNotEmpty(itemName)){
			reqParam.put("itemName",itemName);
		}
		if (ObjectUtils.isNotNull(itemValue)){
			reqParam.put("itemValue",itemValue);
		}
		if (ObjectUtils.isNotNull(start) && ObjectUtils.isNotNull(limit)){
			reqParam.put("start",start);
			reqParam.put("limit",limit);
		}
		if (StringUtils.isNotEmpty(sort) && StringUtils.isNotEmpty(order)){
			reqParam.put("sort",sort);
			reqParam.put("order",order);
		}
		Integer total = dictionaryService.getDictionaryCount(reqParam);
		List<Dictionary> dictionaryList = new ArrayList<>();
		if (total>0){
			dictionaryList = dictionaryService.getDictionaryList(reqParam);
		}

		Map<String,Object> resultMap= ResultGenerator.getSuccessMap();
		resultMap.put("total", total);
		resultMap.put("rows", dictionaryList);
		return resultMap;
	}

	@GetMapping("/getDictionaryDetail")
	@ResponseBody
	public Map<String,Object> getDictionaryDetail(Long id) {
		Dictionary dictionary = dictionaryService.getDictionaryDetail(id);

		if (ObjectUtils.isNull(dictionary)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),"数据为空！");
		}

		Map<String,Object> result = ResultGenerator.getSuccessMap();
		result.put("data", dictionary);
		return result;
	}

	@PostMapping("/saveDictionary")
	@ResponseBody
	public Map<String,Object> saveDictionary(Dictionary dictionary) {
		String errMsg= dictionaryService.saveDictionary(dictionary);
		if (StringUtils.isNotEmpty(errMsg)){
			return ResultGenerator.getFailMap(ResultCode.CODE_FAIL.getCode(),errMsg);
		}

		return ResultGenerator.getSuccessMap();
	}
}
