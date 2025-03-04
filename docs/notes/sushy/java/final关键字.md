# final关键字

> final可以修饰类、方法、变量，对于修饰类，使它不能被继承，修饰方法，使方法不能被重写，修饰变量，使变量不能被修改
>
> finally 则是 Java 保证重点代码一定要被执行的一种机制。我们可以使用 try-finally 或者 try-catch-finally 来进行类似关闭 JDBC 连接、保证 unlock 锁等动作。
>
> finalize 是基础类 java.lang.Object 的一个方法，它的设计目的是保证对象在被垃圾收集前完成特定资源的回收。finalize 机制现在已经不推荐使用，并且在 JDK 9 开始被标记为 deprecated。

## 性能

- final可能在JVM上有性能上的提高，但是从开发实践的角度上，这只是一种小技巧上的提升，并不会在性能上有很大的提高

## 并发

- 使用 final 修饰参数或者变量，也可以清楚地避免意外赋值导致的编程错误，甚至，有人明确推荐将所有方法参数、本地变量、成员变量声明成 final。
- final 变量产生了某种程度的不可变（immutable）的效果，所以，可以用于保护只读数据，尤其是在并发编程中，因为明确地不能再赋值 final 变量，有利于减少额外的同步开销，也可以省去一些防御性拷贝的必要。

final并不等同于**immutable**（不变），

```java
 final List<String> strList = new ArrayList<>();
 strList.add("Hello");
 strList.add("world");  
 List<String> unmodifiableStrList = List.of("hello", "world");
 unmodifiableStrList.add("again");
```

里面的strList只是引用不能在赋值，其对象行为不被final影响，例如可以进行add行为，但是如果想对行为进行限制，可以使用of方法，如果再进行add就会报错

如果需要实现immutable的类，下面的方法再并发里面也适用，需要做到：

- 将 class 自身声明为 final，这样别人就不能扩展来绕过限制了。
- 将所有成员变量定义为 private 和 final，并且不要实现 setter 方法。
- 通常构造对象时，成员变量使用深度拷贝来初始化，而不是直接赋值，这是一种防御措施，因为你无法确定输入对象不被其他人修改。
- 如果确实需要实现 getter 方法，或者其他可能会返回内部状态的方法，使用 copy-on-write 原则，创建私有的 copy。

## 垃圾回收

- finalize 对于垃圾回收，会降低性能，因为再其为空的时候，就会使系统变慢
- 因为，finalize 被设计成在对象被**垃圾收集前**调用，这就意味着实现了 finalize 方法的对象是个“特殊公民”，JVM 要对它进行额外处理。finalize 本质上成为了快速回收的阻碍者，可能导致你的对象经过多个垃圾收集周期才能被回收。
- 对于垃圾回收需要做到：**资源用完即显式释放，或者利用资源池来尽量重用**。
- Java平台正使用 java.lang.ref.Cleaner 来替换掉原有的 finalize 实现，leaner 的实现利用了幻象引用（PhantomReference），这是一种常见的所谓 post-mortem 清理机制