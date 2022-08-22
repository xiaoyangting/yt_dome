# 外键是用于另一张表的关联, 是能确定另一张表记录的字段, 用于保持数据的一致性. 比如 A表里面存储 B表对应的主键的字段, 那它就是外键

creact table products (
  id int auto_increment,
  title varchar(20) not null,
  price int not null,
  score FLOAT,
  url varchar(20),
  foreign key(brand_id) references brand(id) # 创建一个外键 字段名为 brand_id 外键的参照表是 brand 里面的id  
)


# 如果products 表已存在, 但是没有外键外键约束, 这个时候加上一个 brand_id 字段, 再把brand_id 设置为外键. 例
alter table `products` add `brand_id` int;
alter table `products` add foreign key(brand_id) references brand(id)

# 修改和删除外键引用的id
  # 如果products 中引用的外键被更新了或者删除了, 这个时候会出现什么情况呢(默认情况下是会报错的); 首先我们得知道 几种外键的 on 事件
  # 如果我们希望可以更新或者删除, 我们需要修改 on delete 或者 on update
  ; RESTRICT (默认属性 限制): 当更新或删除某条外键引用id数据时, 会检查该数据是否有关联的外键数据, 有的话会报错, 不允许更新或删除
  ; NO ACTION: 和 restrict 是一致的, 是在sql 标准中定义的
  ; CASCADE (串联): 当更新或删除某条外键引用id数据是, 会检查改数据是否有关联的外键记录, 有的话会报错
  ;                           更新: 那么会更新对应的所有关联的数据
  ;                           删除: 那么关联的数据会一起被删除掉 (需要注意的是 是删除关联的数据 不是删除关联数据的外键引用)
  ; SET NULL (设置为空): 当更新或删除某个数据时, 会检查改数据是否有关联的外键记录, 有的话, 则将对应的数据设置为null

  ; 那么怎么更改我们的 on delete 和 on update 的类型更改呢?
  # 1. 我们需要知道要更改哪个外键 如 user_ibfk_1
  show create table `products` # 显示创建时的语句
;   CREATE TABLE `user` (
;   `id` int NOT NULL AUTO_INCREMENT,
;   `name` varchar(10) NOT NULL,
;   `phone` varchar(20) DEFAULT NULL,
;   `createTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
;   `updateTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
;   `brand_id` int DEFAULT NULL,
;   PRIMARY KEY (`id`),
;   UNIQUE KEY `phoneNum` (`phone`),
;   KEY `brand_id` (`brand_id`),
;   CONSTRAINT `user_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `users` (`id`)
; ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3

  # 2. 根据名称将外键删除掉, 需要注意的是 是删除外键 不是删除该字段, 所以我们才需要第一步来显示真正的外键字    段
  alter table `products` drop  `user_ibfk_1`

ALTER TABLE `user` ADD FOREIGN KEY(`brand_id`) REFERENCES users(id)
											 ON UPDATE CASCADE
											 on DELETE RESTRICT
