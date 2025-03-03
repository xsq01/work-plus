---
title: static关键字
createTime: 2025/03/02 21:42:19
permalink: /sushy/klpfwplr/
---
# static关键字

## 定义

> 它可以修饰类（只能是内部类）、方法、变量
>
> 静态类，不需要外部类实例化就可以创建
>
> 方法：任何类都可以直接使用
>
> 变量：类名.变量名

## 深度分析static关键字

java内存结构图

![img](https://pica.zhimg.com/v2-57af372ebfa0db75ded2676b33e94306_r.jpg)

解释上图的每个区：

**堆区:** 1、存储的全部是对象，每个对象都包含一个与之对应的class的信息。(class的目的是得到操作指令) 2、jvm只有一个堆区(heap)被所有线程共享，堆中不存放基本类型和对象引用，只存放对象本身

**栈区:** 1.每个线程包含一个栈区，栈中只保存基础数据类型的对象和自定义对象的引用(不是对象)，对象都存放在堆区中 2、每个栈中的数据(原始类型和对象引用)都是私有的，其他栈不能访问。 3、栈分为3个部分：基本类型变量区、执行环境上下文、操作指令区(存放操作指令)。

 **方法区:** 1、又叫静态区，跟堆一样，被所有的线程共享。方法区包含所有的class和static变量。2、方法区中包含的都是在整个程序中永远唯一的元素，如class，static变量。

```java
public class Person {
    //静态变量
    static String firstName;
    String lastName;
    public void showName(){
        System.out.println(firstName+lastName);
    }
    //静态方法
    public static void viewName(){
      System.out.println(firstName);
    }
    
    public static void main(String[] args) {
        Person p =new Person();
        Person.firstName = "张";
        p.lastName="三";
        p.showName();
        
        Person p2 =new Person();
        Person.firstName="李";
        p2.lastName="四";
        p2.showName();
    }
}
//输出。张三、李四
```

里面的p1、p2就是存储在栈区，Person，成员变量lastname存储在堆中，静态方法viewname，和变量firstname存在方法区

### static的特点:

- static是一个修饰符，用于修饰成员。（成员变量，成员函数）static修饰的成员变量 称之为静态变量或类变量。
- static修饰的成员被所有的对象共享。
- static优先于对象存在，因为static的成员随着类的加载就已经存在。
-  static修饰的成员多了一种调用方式，可以直接被类名所调用，（类名.静态成员）。
-  static修饰的数据是共享数据，对象中的存储的是特有的数据。

### 成员变量和静态变量的区别：

- 成员变量随着对象的创建存在随着对象的回收而释放。
- 静态变量随着类的加载而存在随着类的消失而消失。
- 成员变量也成为实例变量
- 静态变量成为类变量

### 注意

​       1、静态方法只能访问静态成员。（非静态既可以访问静态，又可以访问非静态）

　　2、静态方法中不可以使用this或者super关键字。

　　3、主函数是静态的

