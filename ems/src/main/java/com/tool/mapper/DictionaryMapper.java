package com.tool.mapper;

import com.tool.model.Dictionary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface DictionaryMapper {
    Integer getDicCodeCount(Map<String,Object> param);

    List<String> getDicCodeList(Map<String,Object> param);

    Integer getDictionaryCount(Map<String,Object> param);

    List<Dictionary> getDictionaryList(Map<String,Object> param);

    Dictionary getById(@Param("id") Long id);

    Integer insertDictionary(Dictionary dictionary);

    Integer updateDictionary(Dictionary dictionary);
}