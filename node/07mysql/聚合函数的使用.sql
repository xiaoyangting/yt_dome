# 求所有手机价格的总和
select sun(price) from `products`; # sun 会返回所有对应值的总和
# 求一下华为手机的价格总和
select sun(price) from `products` where brand = '华为';

# 求华为手机的平均价格
select avg(price) from `products` where brand = `华为`; # 注意条件判断一般都放都后面, 除了配合    

# 最高价格的手机 和 最低价格的手机
select max(price) from `products`;
select min(price) from `products`;

# 求华为手机的个数
select count(*) from `products` where brand = '华为'; # * 的话是表示全部
select count(*) from `products` where brand = '苹果'; 
# 求苹果手机url 不为空的条数
select count(url) from `products` where brand = '苹果'; 
# 求手机表里面价格不相同的手机
select count(DISTNCT price) from `products`;

# group by 关键字的使用( 对数据进行分组 )
# 需求 对华为 小米 苹果手机进行分组, 获取平均价格 和 个数 和 平均评分
select brand, avg(price), count(*), avg(score) from `products` group by brand;

# having 的使用(搭配 group by 进行条件筛选,  having 是分组之后进行筛选的)
# 需求 对华为 小米 苹果手机进行分组, 获取平均价格 和 个数 和 平均评分, 筛选价格大于2000以上的分组
select brand, avg(price), count(*), avg(score) from `products` group by brand having price > 2000;

# 需求 对华为 小米 苹果手机进行分组, 获取平均价格 和 个数 和 平均评分, 筛选价格大于2000以上的分组   
# 这样会出现语法错误 ( 问where 是筛选之后再进行分组的 )
select brand, avg(price), count(*), avg(score) from `products` group by brand where price > 2000;   
# 语法正确  
select brand, avg(price), count(*), avg(score) from `products` where price > 2000 group by brand 

