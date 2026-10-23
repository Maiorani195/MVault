package com.mvault.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI mvaultOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MVault API")
                        .description("Sistema de Gestão de Estoque — REST API")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Fernando Maiorani Costa")
                                .url("https://github.com/SEU_USUARIO/mvault")));
    }
}
