package com.xzl.transaction;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.xzl.transaction.Mapper")
@EnableScheduling
public class XzlApplication {
    public static void main(String[] args) {
        SpringApplication.run(XzlApplication.class, args);

    }
}

