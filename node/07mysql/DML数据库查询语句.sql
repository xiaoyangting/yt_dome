# 在开发中, 我们下午根据条件来筛选我们的数据, 这个时候我们要使用条件查询
# 条件查询会使用 wehre 查询句

# 查询价格小于 1000的手机\
SELECT * FROM `products` WHERE price < 1000 

# 查询价格大于 2000的手机
select * from `products` where price > 2000

# 查询价格等于 3999的手机
select * from `products` where price = 3999

# 查询价格不等于 3999的手机
select * from `products` where price <> 3999 # 也可以使用 != 但是这种有兼容性问题

# 查询华为手机
select * from `products` where brand = '华为'


# 查询品牌是华为, 并且小于 2000的手机
select * from `products` where brand = `华为` and price > 2000
select * from `products` where brand = `华为` && price > 2000

# 查询1000到2000的手机 (不包含1000 2000)
SELECT * from `products` where price > 1000 and price < 2000

# 查询1000到2000的手机 (包含1000到2000)
select * from `products` where price between 1000 and 2000

# or || : 符合一个条件即可
# 查询所有的华为手机 或者价格小于 1000 的手机
select * from `products` where price > 1000 or brand = `华为`

# 查询所有的小米 华为手机
select * from `products` where barnd = '小米' || barnd = `华为`
select * from `products` where barnd in (`小米`, `华为`); # in 可以对查询多个结果

# 模糊查询使用 like 关键字, 结合两个特殊符号: 
    # % 表示匹配任意个 的 任意字符
    # _ 表示匹配一个 的 任意字符
# 查询所有以 V 开头的title 
select * from `products` where title link `V%`

# 查询带M的title
select * from `products` where title link `%M%`

# 查询带M的title 必须是第三个字符
select * from `products` where title link `__M%`


# 对结果进行排序(升序 降序)
select * from `products` where barnd in (`小米`, `苹果`, `华为`)
                                     ORDER BY price ASC, score(评分) DESC  # 查找 品牌为 小米 苹果 华为 的商品, 按照 price来升序, 价格相等的按照 score(评分)来降序


# 分页查询
select * from `products` limit 20 offset 0 # 查20条数 从0偏移量开始 (也就是 20条第一页)
select * from `products` limit 20 offset 20 # 查20条数 从20偏移量开始 (也就是 20条第二页)

select * from `products` where price > 1000 and  price < 2000 limit 20 offset 0