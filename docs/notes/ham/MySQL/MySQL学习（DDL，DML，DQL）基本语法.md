---
title: MySQL学习（DDL，DML，DQL）基本语法
createTime: 2025/02/24 19:15:53
permalink: /ham/ng6vwhld/
---
# MySQL学习（DDL，DML，DQL）基本语法

## DDL
* 使用某个数据库

```sql
use world;
```
* 展示表

```sql
show tables;
```
* 创建表

```sql
 create table student(
    id int,
    name varchar(10),
    age int,
    gender varchar(10)
  );
```
* 删除表

```sql
drop table student; 
```
* 修改表结构
1. 查看表结构
```sql
  desc student;
```
2. 添加列
```sql
  alter table student add dept varchar(10);
```
3. 修改列名和类型
```sql
  alter table student change name st_name varchar(10);
```
4. 删除列
```sql
  alter table student drop dept;
```
5. 修改表名
```sql
  rename table student to st;
```
## DML
* 数据操作
1. 插入数据
```sql
insert into student values(1, '鲁思豪', 21, '男'), (2, '撒刀锋战士', 18, '男'), (3, '发送端', 17, '女'), (4, '问啊发大水', 38, '男'), 
  (5, '雨课堂', 27, '女'), (6, '当然土豪', 5, '女'), (7, '首都儿', 25, '女'), (8, '饿死认同感', 24, '男'), (9, '散热通过', 31, '女'), (10, '色让他', 22, '男'); 
```
2. 删除数据（id小于4的数据）
```sql
  delete from student where id < 4;
```
3. 更新数据
```sql
  update student set name = '谢谢小星星' where id = 4;
```

* 约束
1. 主键约束(primary key) PK:  唯一加非空
   创建时加上：[constraint pk1] primary key(字段1，字段2)
   创建好后，使用
```sql
ALTER TABLE student ADD PRIMARY KEY (id);
```
删除主键约束：
```sql
ALTER TABLE student DROP PRIMARY KEY;
```
2. 自增长约束(auto_increment): 实现主键的自增长
   在创建表时在primary key后加auto_increment
   设置开始值：在create的括号后加auto_increment = min, 或在创建表结束后使用ALTER TABLE student auto_increment = min
   delete删除数据后，自增长从最后一个值基础上增长，turncate删除数据后，自增长从默认开始值增长
3. 非空约束(not null)
   -- 创建表时加not null，或
```sql
 ALTER TABLE student MODIFY name VARCHAR(10) NOT NULL;
```
删除约束

```sql
ALTER TABLE student MODIFY name VARCHAR(10);
```

4. 唯一性约束(unique)
   创建表时加unique, 或
```sql
ALTER TABLE student ADD CONSTRAINT unique_pn unique(id); 
```
删除唯一约束
```sql
ALTER TABLE student DROP INDEX unique_pn;
```
5. 默认约束(default)
   创建表时加default ‘默认值’，或
```sql
ALTER TABLE student MODIFY dept VARCHAR(10) DEFAULT 'sdas';
```
删除默认约束
```sql
 ALTER TABLE student MODIFY dept VARCHAR(10) DEFAULT NULL;
```
6. 零填充约束(zerofill): 插入数据是，当该字段的长度小于定义长度时，会在该值前面补0，zerofill默认为int（10）
   创建表时加zerofill
   删除零填充约束：ALTER TABLE student MODIFY '字段'
## DQL
* 查询数据

```sql
select id, name from student;
```

* 别名

```sql
	-- 表别名
      SELECT * FROM student AS p;
    -- 列别名
      SELECT id AS '编号', name AS '名字' FROM student;
```
* 去掉重复值

```sql
    SELECT DISTINCT age FROM student;
    SELECT DISTINCT * FROM student;
```
* 运算查询

```sql
    SELECT name, age +10 FROM student;
```
* 过滤
```sql
    select * from student where age > 20;
```
* 模糊匹配

```sql
    SELECT * FROM student where name LIKE '%发%'; -- %匹配任意字符
    SELECT * FROM student where name LIKE '_思%'; -- _匹配任意字符
```
* least和greatest

```sql
    SELECT LEAST(10, 5, 20) AS min_number;  -- 最小值
    SELECT GREATEST(10,20,30) AS max_number;  -- 最大值
```
* 分组聚合

```sql
select gender, avg(age), sum(age), max(age), min(age), count(*) from student group by gender; 
    -- 分组后的结果筛选  having
      SELECT gender, avg(age), sum(age), max(age), min(age), count(*) FROM student GROUP BY gender HAVING AVG(age) > 22;
```
* 排序

```sql
    select * from student where age > 20 order by age asc;
    select * from student where age > 20 order by age desc;
```
* 分页

```sql
    select * from student limit 5; # 限制取5条数据
    select * from student limit 9, 5; # 跳过10条取5条数据
```
* INSERT INTO SELECT语句

```sql
    INSERT INTO student SELECT * FROM stu;
    INSERT INTO student(id, name, age) SELECT id, name, age FROM stu;
```
* 正则表达式

```sql
    -- ^ 在开头进行匹配
      SELECT 'abcdefg' REGEXP '^a'; -- 1
    -- $ 在结尾匹配
      SELECT 'grfdgsrte' REGEXP 'e$'; -- 1
    -- . 匹配任意单个字符（除了换行符）
      SELECT 'asdasf' REGEXP '.s';  -- 1
      SELECT 'asdasf' REGEXP 'a.';  -- 1
      SELECT 'asdasf' REGEXP '.f';  -- 1
    -- [...] 匹配括号内任意单个字符
      SELECT 'zsfrsdfr' REGEXP '[abc]'; -- 0
      SELECT 'faredfarews' REGEXP '[ared]'; -- 1
    -- [^...] 匹配括号内任意字符之外的字符
      SELECT 'a' REGEXP '[^abc]'; -- 0
      SELECT 'x' REGEXP '[^abc]'; -- 1
      SELECT 'abc' REGEXP '[^a]'; -- 1
    -- a* 匹配0个或多个a，包括空字符串，可以作为占位符用，有没有指定字符都可以匹配到数据
      SELECT 'stab' REGEXP '.ta*b'; -- 1
      SELECT 'stb' REGEXP '.ta*b';  -- 1
      SELECT '' REGEXP 'a*'; -- 1
    -- a+ 匹配1个或多个a，不包括空字符串
      SELECT 'stab' REGEXP '.ta+b'; -- 1
      SELECT 'stb' REGEXP '.ta+b';  -- 0
      SELECT '' REGEXP 'a+'; -- 0
    -- a? 匹配0个或1个a
      SELECT 'stab' REGEXP '.ta?b'; -- 1
      SELECT 'stb' REGEXP '.ta?b';  -- 1
      SELECT 'staab' REGEXP '.ta?b'; -- 0
    -- a1|a2 匹配a1或a2
      SELECT 'a' REGEXP 'a|b';  -- 1
      SELECT 'bc' REGEXP 'a|b';  -- 1
      SELECT 'c' REGEXP 'a|b';  -- 0
    -- a{m} 匹配m个a
      SELECT 'abbba' REGEXP 'ab{3}a'; -- 1
      SELECT 'abbba' REGEXP 'ab{4}a'; -- 0
    -- a{m,} 匹配m个或更多a
      SELECT 'abbbbbbba' REGEXP 'ab{2,}a'; -- 1
    -- a{m, n} 匹配m到n个a
      SELECT 'abbbbba' REGEXP 'ab{2,7}a'; -- 1
      SELECT 'aba' REGEXP 'ab{2,7}a';  -- 0 
```
