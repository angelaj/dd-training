package com.tool.common.utils;


import com.tool.model.SysResource;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * 权限数据处理
 */
public class TreeUtils {
    /**
     * 根据父节点的ID获取所有子节点
     *
     * @param list     分类表
     * @param parentId 传入的父节点ID
     * @return String
     */
    public static List<SysResource> getChildPerms(List<SysResource> list, int parentId) {
        List<SysResource> returnList = new ArrayList<SysResource>();
        for (Iterator<SysResource> iterator = list.iterator(); iterator.hasNext(); ) {
            SysResource t = (SysResource) iterator.next();
            // 一、根据传入的某个父节点ID,遍历该父节点的所有子节点
            if (t.getParentId() == parentId) {
                recursionFn(list, t);
                returnList.add(t);
            }
        }
        return returnList;
    }

    /**
     * 递归列表
     *
     * @param list
     * @param t
     */
    private static void recursionFn(List<SysResource> list, SysResource t) {
        // 得到子节点列表
        List<SysResource> childList = getChildList(list, t);
        t.setChildren(childList);
        for (SysResource tChild : childList) {
            if (hasChild(list, tChild)) {
                // 判断是否有子节点
                Iterator<SysResource> it = childList.iterator();
                while (it.hasNext()) {
                    SysResource n = (SysResource) it.next();
                    recursionFn(list, n);
                }
            }
        }
    }

    /**
     * 得到子节点列表
     */
    private static List<SysResource> getChildList(List<SysResource> list, SysResource t) {

        List<SysResource> tlist = new ArrayList<SysResource>();
        Iterator<SysResource> it = list.iterator();
        while (it.hasNext()) {
            SysResource n = (SysResource) it.next();
            if (n.getParentId().longValue() == t.getId().longValue()) {
                tlist.add(n);
            }
        }
        return tlist;
    }

    List<SysResource> returnList = new ArrayList<SysResource>();

    /**
     * 根据父节点的ID获取所有子节点
     *
     * @param list   分类表
     * @param typeId 传入的父节点ID
     * @param prefix 子节点前缀
     */
    public List<SysResource> getChildPerms(List<SysResource> list, int typeId, String prefix) {
        if (list == null) {
            return null;
        }
        for (Iterator<SysResource> iterator = list.iterator(); iterator.hasNext(); ) {
            SysResource node = (SysResource) iterator.next();
            // 一、根据传入的某个父节点ID,遍历该父节点的所有子节点
            if (node.getParentId() == typeId) {
                recursionFn(list, node, prefix);
            }
            // 二、遍历所有的父节点下的所有子节点
            /*
             * if (node.getParentId()==0) { recursionFn(list, node); }
             */
        }
        return returnList;
    }

    private void recursionFn(List<SysResource> list, SysResource node, String p) {
        // 得到子节点列表
        List<SysResource> childList = getChildList(list, node);
        if (hasChild(list, node)) {
            // 判断是否有子节点
            returnList.add(node);
            Iterator<SysResource> it = childList.iterator();
            while (it.hasNext()) {
                SysResource n = (SysResource) it.next();
                n.setResourceName(p + n.getResourceName());
                recursionFn(list, n, p + p);
            }
        } else {
            returnList.add(node);
        }
    }

    /**
     * 判断是否有子节点
     */
    private static boolean hasChild(List<SysResource> list, SysResource t) {
        return getChildList(list, t).size() > 0 ? true : false;
    }
}

