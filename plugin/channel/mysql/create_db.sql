SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `plc`
-- ----------------------------
-- DROP TABLE IF EXISTS `plc`;
CREATE TABLE `plc` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `tstamp` timestamp NOT NULL, COMMENT '时间戳',
  `vint` int(8) NOT NULL DEFAULT '-1' COMMENT '归一化和取整实时变量值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6000000 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `plc`
-- ----------------------------
BEGIN;
INSERT INTO `plc` VALUES ('20071208154958123', '24987'), 
(UNIX_TIMESTAMP(now()), '34567'), 
('20081208154958123', '34567'), 
('20091208154958123', '34567'), 
('20171208154958123', '34567');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
--------------------- 

CREATE DATABASE tiger;

CREATE TABLE `test` (
    `id` int(11) NOT NULL auto_increment,

    PRIMARY KEY (`id`)
);

ALTER TABLE `test`
    ADD COLUMN `name` varchar(20);

