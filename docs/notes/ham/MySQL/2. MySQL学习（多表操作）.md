---
title: MySQL学习（多表操作）
createTime: 2025/02/24 19:15:53
permalink: /ham/tfbo1j86/
---
# MySQL学习（多表操作）

## 基本知识
### 一对多
- 创建部门表 -- 主表

```sql
create table if not exists dept(
    deptno varchar(20) primary key ,
    name varchar(20)
);
```
- 创建员工表 -- 创建外键约束 方式1`constraint emp_fk foreign key(dept_id) references dept(deptno)`
```sql
create table if not exists emp(
    eid varchar(20),
    ename varchar(20),
    age int,
    dept_id varchar(20),
    constraint emp_fk foreign key(dept_id) references dept(deptno)
);
```
- 方式2`alter table emp add constraint emp2_fk foreign key(dept_id) references dept(deptno);`
- 插入数据（从表添加数据时必须依赖主表的主键列）
```sql
-- 先给主表添加数据
    insert into dept values('1001','研发部');
    insert into dept values('1002','销售部');
    insert into dept values('1003','财务部');
    insert into dept values('1004','人事部');
    -- 从表添加数据时必须依赖主表的主键列
    insert into emp values('1','张三',20,'1001');
    insert into emp values('2','李四',21,'1001');
    insert into emp values('3','王五',23,'1001');
    insert into emp values('4','赵六',18,'1002');
    insert into emp values('5','钱七',35,'1002');
    insert into emp values('6','孙八',33,'1003');
    insert into emp values('7','周九',50,'1003');
    insert into emp values('8','吴十',45,'1004');
    insert into emp values('9','郑十一',30,'1005');
```
- 删除emp表的数据`delete from emp where dept_id='1004';`
- 当主表受依赖时不能删除`delete from dept where deptno='1002';   -- 报错`
- 删除外键约束`alter table emp drop foreign key emp_fk;`
### 多对多（中间表是从表）
- 创建学生表

```sql
create table if not exists student(
    sid int primary key auto_increment,
    name varchar(20),
    age int,
    gender varchar(20)
);
```
- 创建课程表
```sql
create table if not exists course(
    cid int primary key auto_increment,
    cidname varchar(20)
);
```
- 创建中间表

```sql
create table if not exists score(
    sid   int,
    cid   int,
    score double
);
```
- 添加外键约束

```sql
alter table score add constraint score_fk1 foreign key (sid) references student(sid);
alter table score add constraint score_fk2 foreign key (cid) references course(cid);
```
- 插入数据

```sql
-- 学生表
    insert into student values(null,'张三',20,'男'), (null,'李四',21,'男'), (null,'王五',23,'女');
    -- 课程表
    insert into course values(null,'语文'), (null,'数学'), (null,'英语');
    -- 中间表
    insert into score values(1,1,80), (1,2,90), (1,3,75), (2,1,70), (2,3,85), (3,2,95);
```
### 多表查询
+ 交叉连接查询，笛卡尔积(会产生大量冗余数据)`select * from dept,emp;`
+ 内连接查询 求多张表的交集
  隐式内连接`select * from dept,emp where dept.deptno=emp.dept_id;`
  显式内连接`select * from dept inner join emp on dept.deptno=emp.dept_id;`
  -- 查询每个部门的所属员工`select * from dept inner join emp on dept.deptno=emp.dept_id;`
  -- 查询研发部门的所属员工`select * from dept inner join emp on dept.deptno=emp.dept_id and dept.name='研发部';`
  -- 查询每个部门的所属员工数量并升序排列`select dept.name, count(*) from dept inner join emp on dept.deptno=emp.dept_id
  group by dept.name order by count(*);`
  -- 查询每个部门的所属员工数量大于等于2的并降序排列`select dept.name, count(*) from dept inner join emp on dept.deptno=emp.dept_id
  group by dept.name having count(*) >= 2 order by count(*) desc;`
+ 外连接查询(这里删除了外键约束)

```sql
	-- 左外连接（查询哪些部门有员工，哪些没有）
    select * from dept left outer join emp on dept.deptno=emp.dept_id;
    -- 右外连接（查询哪些员工属于哪个部门，哪些没有）
    select * from dept right outer join emp on dept.deptno=emp.dept_id;
    -- 全外连接(union)(查询所有部门和员工)
    select * from dept left outer join emp on dept.deptno=emp.dept_id
    union
    select * from dept right outer join emp on dept.deptno=emp.dept_id;
```
+ 子查询（select嵌套）

```sql
	-- 单行单列：返回具体列的内容，可以理解为一个单值数据
        -- 查询年龄最大的员工信息
        select * from emp where age = (select max(age) from emp);
    -- 单行多列：返回一行中多个列的数据

    -- 多行单列：返回多行中同一列的内容，相当于给出一个操作范围
        -- 查询研发部和销售部的员工信息
        select * from emp join dept on emp.dept_id = dept.deptno where (dept.name='研发部' or dept.name='销售部');  -- 关联查询
        select * from emp where dept_id in (select deptno from dept where name='研发部' or name='销售部');    -- 子查询
    -- 多行多列：返回的是一张临时表
        select * from emp join dept on emp.dept_id = dept.deptno where (emp.age > 20 and dept.name='研发部');
        select * from (select * from emp where age > 20) t1 join (select * from dept where name='研发部') t2 on t1.dept_id = t2.deptno;
```
+ 关键字

```sql
        -- ALL
        -- 查询年龄大于‘1001’部门的所有员工的信息
        select * from emp where age > all (select age from emp where dept_id = '1001');
        -- 查询不属于任何一个部门的员工的信息
        select * from emp where dept_id != all (select deptno from dept);

        -- ANY和some是等价的
        -- 查询年龄大于‘1001’部门的任意一个员工的信息
        select * from emp where age > any (select age from emp where dept_id = '1001');

        -- IN
        -- 查询研发部和销售部的员工信息
        select eid, ename from emp where dept_id in (select deptno from dept where name='研发部' or name='销售部');

        -- exists
        -- 查询是否有年龄大于40岁的员工，有则返回所有员工信息，否则返回空
        select * from emp a where exists(select * from emp where a.age > 40 );
        -- 查询有所属部门的员工信息
        select * from emp a where exists(select * from dept where dept.deptno = a.dept_id);
```
+ 自关联查询（必须给表起别名）
  准备数据

```sql
-- 创建表，建立自关联约束
        create table t_sanguo(
            eid int primary key,
            ename varchar(20),
            manager_id int, -- 外键列
            foreign key(manager_id) references t_sanguo(eid)
        );
    -- 插入数据
    insert into t_sanguo values(1, '刘协', null);
    insert into t_sanguo values(2, '刘备', 1);
    insert into t_sanguo values(3, '关羽', 2);
    insert into t_sanguo values(4, '张飞', 2);
    insert into t_sanguo values(5, '曹操', 1);
    insert into t_sanguo values(6, '许褚', 5);
    insert into t_sanguo values(7, '典韦', 5);
    insert into t_sanguo values(8, '孙权', 1);
    insert into t_sanguo values(9, '周瑜', 8);
    insert into t_sanguo values(10, '鲁肃', 8);
```
进行关联查询

```sql
        -- 查询每个员工的姓名和直接上级的姓名
        select a.ename, b.ename from t_sanguo a inner join t_sanguo b on a.manager_id = b.eid;
        -- 查询每个员工的姓名和直接上级的姓名，如果员工没有上级，则显示null
        select a.ename, b.ename from t_sanguo a left join t_sanguo b on a.manager_id = b.eid;
        -- 查询每个员工的姓名和直接上级的姓名和间接上级的姓名
        select
            a.ename, b.ename, c.ename
        from t_sanguo a
            left join t_sanguo b on a.manager_id = b.eid
            left join t_sanguo c on b.manager_id = c.eid;
```
## 练习
+ 准备数据（部门表，员工表，工资等级表）

```sql
create database test1;
use test1;
-- 创建部门表
create table dept(
    deptno int primary key, -- 部门编号
    dname varchar(14),      -- 部门名称
    loc varchar(13)         -- 部门所在地
);
insert into dept values (10, 'accounting', 'new york');
insert into dept values (20, 'researach', 'dallas');
insert into dept values (30, 'sales', 'chicago');
insert into dept values (40, 'operations', 'boston');
-- 创建员工表
create table emp(
    empno int primary key, -- 员工编号
    ename varchar(10),     -- 员工姓名
    job varchar(9),        -- 工作
    mgr int,               -- 上级编号
    hiredate date,         -- 入职日期
    sal double,            -- 薪水
    comm double,          -- 奖金
    deptno int            -- 对应dept表的外键
);
-- 添加部门与员工之间的主外键关系
alter table emp add constraint foreign key emp(deptno) references dept(deptno);

insert into emp values (7369, 'smith', 'clerk', 7902, '1980-12-17', 800, null, 20);
insert into emp values (7499, 'allen', 'salesman', 7698, '1981-02-20', 1600, 300, 30);
insert into emp values (7521, 'ward', 'salesman', 7698, '1981-02-22', 1250, 500, 30);
insert into emp values (7566, 'jones', 'manager', 7839, '1981-04-02', 2975, null, 20);
insert into emp values (7654, 'martin', 'salesman', 7698, '1981-09-28', 1250, 1400, 30);
insert into emp values (7698, 'blake', 'manager', 7839, '1981-05-01', 2850, null, 30);
insert into emp values (7782, 'clark', 'manager', 7839, '1981-06-09', 2450, null, 10);
insert into emp values (7788, 'scott', 'analyst', 7566, '1987-04-19', 3000, null, 20);
insert into emp values (7839, 'king', 'president', null, '1981-11-17', 5000, null,10);
insert into emp values (7844, 'turner', 'salesman', 7698, '1981-09-08', 1500, 0, 30);
insert into emp values (7876, 'adams', 'clerk', 7788, '1987-05-23', 1100, null, 20);
insert into emp values (7900, 'james', 'clerk', 7698, '1981-12-03', 950, null, 30);
insert into emp values (7902, 'ford', 'analyst', 7566, '1981-12-03', 3000, null, 20);
insert into emp values (7934, 'miller', 'clerk', 7782, '1982-01-23', 1300, null, 10);

-- 创建工资等级表
create table salgrade(
    grade int, -- 工资等级
    losal double,  -- 最低工资
    hisal double   -- 最高工资
);
insert into salgrade values (1, 700, 1200);
insert into salgrade values (2, 1201, 1400);
insert into salgrade values (3, 1401, 2000);
insert into salgrade values (4, 2001, 3000);
insert into salgrade values (5, 3001, 9999);
```
+ 1.返回拥有员工的部门名与部门编号

```sql
select dept.dname, dept.deptno from dept where (select count(*) from emp where dept.deptno = emp.deptno) > 0;
select distinct dept.dname, dept.deptno from dept inner join emp on dept.deptno = emp.deptno;
```
+ 2.返回工资比smith高的员工信息

```sql
select * from emp where sal > (select sal from emp where ename = 'smith');
```
+ 3.返回员工和所属经理的姓名

```sql
select a.ename, b.ename from emp a, emp b where a.mgr = b.empno;
```
+ 4.返回入职时间早于经理的员工的姓名和经理姓名

```sql
select a.ename, b.ename from emp a, emp b where a.mgr = b.empno and a.hiredate < b.hiredate;
```
+ 5.返回员工姓名和部门名

```sql
select emp.ename, dept.dname from dept, emp where dept.deptno = emp.deptno;
```
+ 6.返回所有clerk员工的姓名和部门名

```sql
select emp.ename, dept.dname from dept join emp on dept.deptno = emp.deptno where emp.job = 'clerk';
```
+ 7.返回部门编号、最低工资

```sql
select emp.deptno, min(sal) from emp group by emp.deptno;
```
+ 8.返回sales部门的员工的姓名

```sql
select emp.ename from emp where emp.deptno = (select deptno from dept where dname = 'sales');
```
+ 9.返回平均工资高于所有员工平均工资的员工

```sql
select * from emp where emp.sal > (select avg(sal) from emp);
```
+ 10.返回与scott同一职位的员工

```sql
select * from emp where emp.job = (select job from emp where emp.ename = 'scott') and emp.ename != 'scott';
```
+ 11.返回工资高于部门30所有员工的员工

```sql
select * from emp where emp.sal > all (select sal from emp where emp.deptno = 30);
```
+ 12.返回每个职位的最低工资

```sql
select job, min(sal) from emp group by job;
```
+ 13.返回年薪并排序

```sql
select emp.ename, 12 * sal + ifnull(comm, 0) from emp order by (12 * sal + ifnull(comm, 0)) desc ;
```
+ 14.返回工资在等级4的员工

```sql
select a.ename from emp a join salgrade b on (a.sal between b.losal and b.hisal) and b.grade = 4;
```
+ 15.返回工资在等级2的员工的姓名和部门所在地

```sql
select a.ename, b.loc from emp a, dept b, salgrade c where (a.sal between c.losal and c.hisal) and c.grade = 2 and a.deptno = b.deptno;
```
