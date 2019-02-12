package com.tool.service;

import com.tool.model.Dictionary;

import java.util.List;
import java.util.Map;

public interface IDictionaryService {
    Integer getDicCodeCount(Map<String,Object> param);

    List<String> getDicCodeList(Map<String,Object> param);

    Integer getDictionaryCount(Map<String,Object> param);

    List<Dictionary> getDictionaryList(Map<String,Object> param);

    Dictionary getDictionaryDetail(Long dictinaryId);

    String saveDictionary(Dictionary dictionary);
}
