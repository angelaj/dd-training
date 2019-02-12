/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50019
Source Host           : localhost:3306
Source Database       : ms

Target Server Type    : MYSQL
Target Server Version : 50019
File Encoding         : 65001

Date: 2019-02-12 13:11:10
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dictionary
-- ----------------------------
DROP TABLE IF EXISTS `dictionary`;
CREATE TABLE `dictionary` (
  `id` bigint(20) NOT NULL auto_increment,
  `dic_code` varchar(20) default NULL COMMENT '字典编码',
  `item_name` varchar(10) default NULL COMMENT '字典项名称',
  `item_value` int(10) default NULL COMMENT '字典项值',
  `item_seq` int(10) default NULL COMMENT '字典项顺序号',
  `item_remark` varchar(255) default NULL COMMENT '字典项备注',
  `create_time` datetime default NULL COMMENT '创建时间',
  `update_time` datetime default NULL COMMENT '更新时间',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `idx_code_name` USING BTREE (`dic_code`,`item_name`),
  UNIQUE KEY `idx_code_value` USING BTREE (`dic_code`,`item_value`),
  KEY `idx_code` USING BTREE (`dic_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dictionary
-- ----------------------------
INSERT INTO `dictionary` VALUES ('1', 'role_type', '管理员', '1', '2', '角色类别：管理员', '2019-02-11 17:47:28', '2019-02-12 09:31:53');
INSERT INTO `dictionary` VALUES ('2', 'role_type', '操作员', '2', '3', '角色类别：操作员', '2019-02-11 17:47:57', '2019-02-12 09:31:58');
INSERT INTO `dictionary` VALUES ('3', 'resource_type', '目录', '0', '1', '资源类型：目录', '2019-02-11 18:15:25', '2019-02-11 18:15:27');
INSERT INTO `dictionary` VALUES ('4', 'resource_type', '菜单', '1', '2', '资源类型：菜单', '2019-02-11 18:15:47', '2019-02-11 18:15:49');
INSERT INTO `dictionary` VALUES ('5', 'resource_type', '按钮', '2', '3', '资源类型：按钮', '2019-02-11 18:16:07', '2019-02-11 18:16:09');
INSERT INTO `dictionary` VALUES ('6', 'role_type', '超级管理员', '0', '1', '超级管理员拥有最多的权限', '2019-02-12 09:25:45', '2019-02-12 09:31:37');

-- ----------------------------
-- Table structure for sys_resource
-- ----------------------------
DROP TABLE IF EXISTS `sys_resource`;
CREATE TABLE `sys_resource` (
  `id` bigint(20) NOT NULL auto_increment,
  `resource_name` varchar(255) default NULL COMMENT '资源名称',
  `resource_type` int(11) default NULL COMMENT '资源类型,0:目录;1:菜单;2:按钮',
  `resource_code` varchar(255) default NULL COMMENT '资源,唯一标识code',
  `parent_id` bigint(20) default NULL COMMENT '父资源ID',
  `resource_url` varchar(255) default NULL COMMENT '资源url',
  `seq` int(11) default NULL COMMENT '排序',
  `icon` varchar(255) default NULL COMMENT '图标',
  `description` varchar(255) default NULL COMMENT '描述信息',
  `create_time` datetime default NULL,
  `update_time` datetime default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_resource
-- ----------------------------
INSERT INTO `sys_resource` VALUES ('1', '系统管理', '0', 'system:manager', '0', '', '2', 'fa-cog', '系统管理', '2018-12-06 17:53:04', '2019-02-11 16:06:19');
INSERT INTO `sys_resource` VALUES ('2', '用户管理', '1', 'system:user:manager', '1', '/system/user/manager', '1', '', '用户管理菜单项', '2018-12-06 17:54:17', '2018-12-06 17:54:22');
INSERT INTO `sys_resource` VALUES ('3', '角色管理', '1', 'system:role:manager', '1', '/system/role/manager', '2', null, '角色管理菜单项', '2019-01-28 14:48:39', '2019-01-28 14:48:41');
INSERT INTO `sys_resource` VALUES ('4', '资源管理', '1', 'system:resource:manager', '1', '/system/resource/manager', '3', null, '资源管理菜单项', '2019-01-28 14:49:37', '2019-01-28 14:49:42');
INSERT INTO `sys_resource` VALUES ('6', '基础配置', '0', 'setting:manager', '0', '', '1', 'fa-cogs', '基础数据', '2019-02-11 15:59:21', '2019-02-11 15:59:21');
INSERT INTO `sys_resource` VALUES ('7', '数据字典', '1', 'setting:dictionary:manager', '6', '/setting/dictionary/manager', '1', 'fa-list', '数据字典管理', '2019-02-11 16:05:07', '2019-02-11 16:05:07');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` bigint(20) NOT NULL auto_increment,
  `role_name` varchar(50) default NULL,
  `role_key` varchar(255) default NULL COMMENT '角色key',
  `role_type` int(2) default NULL COMMENT '角色类型 1：管理员；2：操作员',
  `description` varchar(255) default NULL COMMENT '描述信息',
  `create_time` datetime default NULL COMMENT '创建时间',
  `update_time` datetime default NULL COMMENT '更新时间',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('1', '系统管理员', 'administrator', '1', '系统管理员', '2018-10-25 17:51:21', '2019-02-11 16:08:52');
INSERT INTO `sys_role` VALUES ('2', '业务经理', 'manager', '1', '业务经理', '2019-02-02 15:45:50', '2019-02-02 15:45:53');
INSERT INTO `sys_role` VALUES ('3', '操作员', 'user', '2', '一般操作人员', '2019-02-02 15:46:23', '2019-02-09 19:06:29');
INSERT INTO `sys_role` VALUES ('4', '测试人员', 'test', '1', '测试人员', '2019-02-08 19:08:56', '2019-02-08 19:09:00');

-- ----------------------------
-- Table structure for sys_role_resource
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_resource`;
CREATE TABLE `sys_role_resource` (
  `id` bigint(20) NOT NULL auto_increment,
  `role_id` bigint(20) default NULL COMMENT '角色ID',
  `resource_id` bigint(20) default NULL COMMENT '资源ID',
  `create_time` datetime default NULL COMMENT '创建时间',
  `update_time` datetime default NULL COMMENT '更新时间',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `idx_role_resource` USING BTREE (`role_id`,`resource_id`),
  KEY `idx_role` USING BTREE (`role_id`),
  KEY `idx_resource` USING BTREE (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_role_resource
-- ----------------------------
INSERT INTO `sys_role_resource` VALUES ('15', '3', '1', '2019-02-09 19:06:29', '2019-02-09 19:06:29');
INSERT INTO `sys_role_resource` VALUES ('16', '3', '2', '2019-02-09 19:06:29', '2019-02-09 19:06:29');
INSERT INTO `sys_role_resource` VALUES ('18', '3', '3', '2019-02-09 19:06:29', '2019-02-09 19:06:29');
INSERT INTO `sys_role_resource` VALUES ('19', '3', '4', '2019-02-09 19:06:29', '2019-02-09 19:06:29');
INSERT INTO `sys_role_resource` VALUES ('20', '1', '6', '2019-02-11 16:08:52', '2019-02-11 16:08:52');
INSERT INTO `sys_role_resource` VALUES ('21', '1', '7', '2019-02-11 16:08:52', '2019-02-11 16:08:52');
INSERT INTO `sys_role_resource` VALUES ('22', '1', '1', '2019-02-11 16:08:52', '2019-02-11 16:08:52');
INSERT INTO `sys_role_resource` VALUES ('23', '1', '2', '2019-02-11 16:08:52', '2019-02-11 16:08:52');
INSERT INTO `sys_role_resource` VALUES ('25', '1', '3', '2019-02-11 16:08:52', '2019-02-11 16:08:52');
INSERT INTO `sys_role_resource` VALUES ('26', '1', '4', '2019-02-11 16:08:52', '2019-02-11 16:08:52');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` bigint(20) NOT NULL auto_increment COMMENT '自增ID',
  `login_name` varchar(50) NOT NULL COMMENT '登录名（用户邮箱，唯一）',
  `user_name` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(50) NOT NULL COMMENT '密码',
  `description` varchar(255) default NULL COMMENT '描述信息',
  `state` int(2) default NULL COMMENT '用户状态： 1：启用，0：禁用',
  `create_time` datetime default NULL COMMENT '创建时间',
  `update_time` datetime default NULL COMMENT '更新时间',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `idx_unique` USING BTREE (`login_name`),
  KEY `idx_state` USING BTREE (`state`),
  KEY `idx_createtime` USING BTREE (`create_time`),
  KEY `idx_updatetime` USING BTREE (`update_time`),
  KEY `idx_user_password` USING BTREE (`login_name`,`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('1', 'admin@126.com', 'admin', '3931MUEQD1939MQMLM4AISPVNE', '系统管理员，拥有全部权限', '1', '2018-10-13 19:48:17', '2019-02-11 15:56:44');
INSERT INTO `sys_user` VALUES ('2', 'test@126.com', 'test', '3931MUEQD1939MQMLM4AISPVNE', '', '1', '2019-01-31 14:56:42', '2019-02-11 15:56:44');
INSERT INTO `sys_user` VALUES ('11', 'jyy@126.com', 'jyy', '15S0M42QJF104H8TMCUQ6GPKEJ', '', '1', '2019-02-08 17:38:40', '2019-02-11 15:56:44');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `id` bigint(20) NOT NULL auto_increment,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `create_time` datetime default NULL COMMENT '创建时间',
  `update_time` datetime default NULL COMMENT '更新时间',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `idx_role_user` USING BTREE (`user_id`,`role_id`),
  KEY `idx_role` USING BTREE (`role_id`),
  KEY `idx_user` USING BTREE (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES ('6', '1', '1', '2019-02-08 17:26:14', '2019-02-09 16:12:56');
INSERT INTO `sys_user_role` VALUES ('15', '2', '4', '2019-02-08 19:32:44', '2019-02-09 16:13:06');
INSERT INTO `sys_user_role` VALUES ('16', '1', '3', '2019-02-09 16:18:20', '2019-02-09 16:18:23');
INSERT INTO `sys_user_role` VALUES ('30', '11', '3', '2019-02-09 19:05:33', '2019-02-09 19:05:33');
INSERT INTO `sys_user_role` VALUES ('31', '11', '1', '2019-02-09 19:05:33', '2019-02-09 19:05:33');
