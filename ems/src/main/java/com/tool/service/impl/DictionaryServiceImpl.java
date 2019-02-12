package com.tool.service.impl;

import com.tool.mapper.DictionaryMapper;
import com.tool.model.Dictionary;
import com.tool.service.IDictionaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class DictionaryServiceImpl implements IDictionaryService {
    @Autowired
    DictionaryMapper dictionaryMapper;

    @Override
    public Integer getDicCodeCount(Map<String, Object> param) {
        return dictionaryMapper.getDicCodeCount(param);
    }

    @Override
    public List<String> getDicCodeList(Map<String, Object> param) {
        return dictionaryMapper.getDicCodeList(param);
    }

    @Override
    public Integer getDictionaryCount(Map<String, Object> param) {
        return dictionaryMapper.getDictionaryCount(param);
    }

    @Override
    public List<Dictionary> getDictionaryList(Map<String, Object> param) {
        return dictionaryMapper.getDictionaryList(param);
    }

    @Override
    public Dictionary getDictionaryDetail(Long dictinaryId) {
        return dictionaryMapper.getById(dictinaryId);
    }

    @Transactional
    @Override
    public String saveDictionary(Dictionary dictionary) {
        Long dictionaryId = dictionary.getId();
        //新增或更新用户信息
        if (dictionaryId == null){//新增
            dictionary.setCreateTime(new Date());
            dictionary.setUpdateTime(new Date());
            dictionaryMapper.insertDictionary(dictionary);
        }else {
            dictionary.setUpdateTime(new Date());
            dictionaryMapper.updateDictionary(dictionary);
        }

        return "";
    }
}
