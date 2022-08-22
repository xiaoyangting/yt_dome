# 这种查询是把 products 和 drand 全部每个相匹配  products * drand 的条数
select * from `products`, `drand`;
# 这种查询虽然也能查出有关联外键的数据, 但是是从查出来的直积来进行筛选的
select * from `products`, `drand` where products.brand_id = drand.id


# 左链接: left join 获取左表所有记录，即使右表没有对应匹配的记录
# 需求: 查询所有的手机(包括没有品牌信息的手机) 以及对应的品牌
select * from `products` left join `drand` on products.drand_id = brand.id # on 后面不是条件 是关联的外键

# 需求: 查询没有对应品牌的手机
select * from `products` left join `drand` on products.drand_id = brand.id where drand_id is null # 这个才是有条件的 (品牌为null)


# 右链接: right join 用于获取右表所有记录，即使左表没有对应匹配的记录。
# 需求: 查询所有的手机(包括没有品牌信息的手机) 以及对应的品牌
select * from `products` right join `drand` on products.drand_id = brand.id

# 需求: 查询没有对应手机的品牌
select * from `products` right join `drand` on products.drand_id = brand.id where products.brand_id is null 


# 内链接: 指连接结果仅包含符合连接条件的行，参与连接的两个表都应该符合连接条件
# 直接查询有关联的数据
select * from `products` join `brand` on products.drand_id = brand.id;
select * from `products` join `brand` on products.drand_id = brand.id where products.price = 8699


# 全链接
# mysql 是不支持 FULL OUTER JOIN 
# 那么怎么实现全链接呢? 无非就是拿 左连接 与 右链接联合执行(mysql 会去重里面的重复值), 得出全连接
(select * from `products` left join `drand` on products.drand_id = brand.id)
union
(select * from `products` right join `drand` on products.drand_id = brand.id)

# 需求: 查询两表之间 不同的部分
(select * from `products` left join `drand` on products.drand_id = drand.id where drand.id is null)
union
(select * from `products` right join `drand` on products.drand_id = drand.id where products.drand_id is null)


