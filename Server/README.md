# 秒杀功能模块说明

## 1. 功能概述

本模块为现有微服务项目增加了一套完整的高并发商品秒杀解决方案，旨在解决秒杀场景下的三大核心问题：

- **防止商品超卖**：通过Redis预扣减库存和数据库乐观锁机制，双重保障库存的准确性。
- **抵御恶意流量**：基于Google Guava的令牌桶算法实现API限流，有效过滤恶意请求和流量洪峰。
- **优化高并发读写性能**：通过异步下单、缓存预热、数据库索引优化等多种手段，提升系统响应速度和承载能力。

## 2. 技术实现

### 2.1. 核心技术栈

- **限流组件**：`Google Guava RateLimiter`
- **缓存/预扣减**：`Redis`
- **异步消息队列**：`Apache Kafka`
- **持久化**：`MySQL` + `MyBatis`

### 2.2. 实现细节

1.  **令牌桶限流** (`RateLimitAspect.java`)
    - 使用AOP切面，通过自定义注解 `@RateLimit` 对秒杀接口进行限流。
    - 令牌桶算法可以平滑处理突发流量，同时保证了系统的平均处理速率。

2.  **Redis预扣减库存** (`SeckillServiceImpl.java`)
    - 秒杀开始前，通过调用 `/seckill/preload` 接口将商品库存预加载到Redis。
    - 秒杀请求到达时，执行Lua脚本进行原子性的库存预扣减，避免了Java代码中多个Redis命令的非原子性问题。
    - 同时，使用Redis Set记录已成功秒杀的用户，实现接口的幂等性，防止用户重复下单。

3.  **消息队列异步下单** (`SeckillController.java`, `MessageProducerServiceImpl.java`, `SeckillOrderConsumer.java`)
    - Redis预扣减成功后，将订单信息（用户ID、商品ID等）封装成消息，发送到Kafka Topic。
    - 消费者服务监听Topic，异步执行数据库层面的订单创建和库存扣减，实现了请求的削峰填谷。

4.  **防超卖保障** (`IdleItemDao.xml`, `SeckillOrderConsumer.java`)
    - **Redis预扣减**：第一层拦截，快速过滤掉大部分无效请求。
    - **数据库库存校验**：在扣减数据库库存时，使用 `UPDATE ... SET stock = stock - 1 WHERE id = ... AND stock > 0`，利用数据库的原子性操作，确保库存不会被减为负数，这是防止超卖的最终保障。

5.  **性能优化** (`second_hand_trading.sql`)
    - **缓存预热**：秒杀前预加载库存到Redis，减少秒杀过程中对数据库的读压力。
    - **数据库索引**：在 `sh_order` 表的 `user_id` 和 `idle_id` 字段上建议添加索引，以加速订单查询。

## 3. 如何运行

### 3.1. 环境准备

- 确保 `MySQL`, `Redis`, `Apache Kafka` (及Zookeeper) 服务已正确安装并正在运行。
- 根据 `application.properties` 文件中的配置，检查并修改数据库、Redis和Kafka的连接信息。
- 执行 `second_hand_trading.sql` 文件中的SQL语句，初始化数据库和表结构。特别注意，为 `sh_idle_item` 表添加 `stock` 字段，并为相关查询字段添加索引。

### 3.2. 启动项目

- 依次启动 `eureka-server`, `zuul`, `Server` 三个微服务。

### 3.3. 执行秒杀

1.  **发布带库存的商品**
    - 访问前端“发布闲置”页面，现在您可以直接在表单中填写商品的库存数量。

2.  **预热库存到Redis**
    - 发送POST请求到 `http://localhost:8080/seckill/preload` (假设zuul网关端口为8080)
    - 请求参数: `seckillId` (秒杀活动ID), `productId` (商品ID), `stock` (库存数量)

3.  **执行秒杀**
    - 发送POST请求到 `http://localhost:8080/seckill/{seckillId}/{productId}/{userId}`
    - 如果成功，将返回“正在排队中”的提示。
    - 可以在 `Server` 服务的控制台日志中查看订单创建的详细信息。

## 4. 性能测试建议

- 使用JMeter, Gatling等工具模拟高并发请求。
- 重点监控以下指标：
    - **QPS/TPS**：系统每秒处理的请求数和事务数。
    - **响应时间**：秒杀接口的平均响应时间和95%分位响应时间。
    - **Redis/Kafka性能**：命中率、Topic积压、消费速率等。
    - **数据库性能**：连接数、慢查询等。
- 通过压力测试，找到系统的性能瓶颈，并根据测试结果调整限流速率、数据库连接池大小等参数。