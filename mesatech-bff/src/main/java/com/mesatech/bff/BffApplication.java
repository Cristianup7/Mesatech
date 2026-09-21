package com.mesatech.bff;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

// Excluimos explícitamente DataSourceAutoConfiguration para asegurar que el BFF NO pueda conectarse a base de datos
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class BffApplication {

    public static void main(String[] args) {
        SpringApplication.run(BffApplication.class, args);
    }
}
