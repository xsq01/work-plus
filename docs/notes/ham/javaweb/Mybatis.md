---
title: Mybatis
createTime: 2025/02/24 19:15:53
permalink: /ham/hip697rh/
---
# Mybatis

## 一、快速入门

1. 准备工作（创建SpringBoot工程、数据库表、实体类）

2. 引入Mybatis相关依赖，配置Mybatis（数据库连接信息）
   
   在application.properties中添加4要素
   
   ```properties
   #配置数据库连接信息 四要素
   # 驱动类名称
   Spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   # 数据库连接的URL
   Spring.datasource.url = jdbc:mysql://localhost:3306/mybatis
   # 数据库用户名
   Spring.datasource.username = root
   # 数据库密码
   Spring.datasource.password = 230218
   ```

3. 编写SQL语句（注解/XML），如下：
   
   ```java
   @Mapper // 添加这个注解，表示这个接口是一个Mapper接口，这个接口中的方法会自动生成代理对象，将该对象交给IOC容器管理
   public interface UserMapper {
   
       // 查询用户信息
       @Select("select * from user") // Select注解表示查询
       public List<User> list();
   }
   ```

    连接数据库后还是不提示的去设置里搜SQL Dialects  把上边的两个选上MySQL  下边在添加项目路径。

## 二、数据库连接池

- **定义**
1. 是个容器，负责分配、管理数据库连接。

2. 允许应用程序使用一个现有的数据库连接，而不是重新创建一个。

3. 释放空闲时间超过最大空闲时间的连接，避免因为没有是否造成数据库连接遗漏。
- **优势**
1. 资源重用

2. 提升系统响应速度

3. 避免数据库连接遗漏

## 三、基本操作

- 根据ID删除数据 

```java
    @Delete("delete from emp where id = #{id}")
    public int deleteById(Integer id);
```

    返回值表示此次操作影响的记录数。

    #{}为参数占位符，生成预编译的SQL语句，可以提高性能并防止SQL注入。

- 新增数据

```java
    // 新增员工
    @Insert("insert into emp(username, name, gender, image, job, entrydate, dept_id, create_time, update_time)" +
            "values (#{username}, #{name}, #{gender}, #{image}, #{job}, #{entrydate}, #{deptId}, #{createTime}, #{updateTime});")
    public int insertEmp(Emp emp);
```

        主键返回：在数据添加成功后，需要获取插入数据库的主键。使用`@Options`注解。

```java
    @Options(useGeneratedKeys = true, keyProperty = "id") // 获取返回的主键，封装到id属性
```

- 根据ID修改数据

```java
    // 更新数据
    @Update("update emp  set username    = #{username}," +
            "    name        = #{name}," +
            "    gender      = #{gender}," +
            "    image       = #{image}," +
            "    job         = #{job}," +
            "    entrydate   = #{entrydate}," +
            "    dept_id     = #{deptId}," +
            "    update_time = #{updateTime} " +
            "where id = #{id}")
    public int updateEmp(Emp emp);
```

- 查询

```java
    // 根据ID查询数据
    @Select("select * from emp where id = #{id}")
    public Emp getEmpById(Integer id);
```

    防止封装时由于实体类属性名与字段名不一致导致数据为空。开启Mybatis的驼峰命名自动映射开关(application.properties文件中)：

```properties
mybatis.configuration.map-underscore-to-camel-case=true
```

    条件查询

```java
    // 条件查询
    @Select("select * from emp where name like concat('%', #{name}, '%') and gender = #{gender} " +
            "and entrydate between #{begin} and #{end} order by update_time desc")
    public List<Emp> getEmpBySome(String name, Short gender, LocalDate begin, LocalDate end);
```

### XML映射文件

- 在resources中创建XML映射文件，名称与Mapper接口名称一致，并且将XML映射文件和Mapper接口放置在相同包下（**同包同名**）。

- XML映射文件的namespace.属性为**Mapper接口全限定名**一致。

- XML映射文件中sql语句的id与**Mapper接口中的方法名**一致，并保持返回类型一致。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN""http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.ham.mapper.EmpMapper">
<!--    resultType: 单条记录封装的类型-->
    <select id="getEmpBySome" resultType="com.ham.pojo.Emp">
        select * from emp where name like concat('%', #{name}, '%') and gender = #{gender} and
                                entrydate between #{begin} and #{end} order by update_time desc
    </select>
</mapper>
```

## 四、动态SQL

- if标签，用于判断条件是否成立。使用test属性进行条件判断，如果条件为true,则拼接SQL。
  
  ```xml
      <select id="getEmpBySome" resultType="com.ham.pojo.Emp">
          select *
          from emp
          <where>
              <if test="name != null">
                  name like concat('%', #{name}, '%')
              </if>
              <if test="gender != null">
                  and gender = #{gender}
              </if>
              <if test="begin != null and end != null">
                  and entrydate between #{begin} and #{end}
              </if>
          </where>
          order by update_time desc
      </select>
  ```

- where标签，可以动态生成where关键字，并可以自动去除条件中的and或or。

- set标签，动态生成set关键字，自动去除逗号（update中）。

- foreach标签，循环遍历，主要用于批量操作。
  
  - collection：遍历的集合名称  
  
  - item：遍历出的元素  
  
  - separator：分隔符  
  
  - open：遍历开始前拼接的SQL片段  
  
  - close：遍历结束后拼接的SQL片段
  
  如下批量删除操作：
  
  ```xml
      <delete id="deleteEmpByIds">
          delete from emp where id in
              <foreach collection="ids" item="id" separator="," open="(" close=")">
                  #{id}
              </foreach>
      </delete>
  ```

- sql和include标签，抽取部分重复代码并在需要的位置引用。
  
  ```xml
      <sql id="commonSelect">
          select id, username, password, name, gender, image, job, entrydate, dept_id, create_time, update_time
          from emp
      </sql>
  ```
  
  ```xml
  <include refid="commonSelect"/>
  ```
