package com.prometech.growupapi.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**") // permite para todas as rotas
				.allowedOrigins("http://localhost:5173") // libera seu frontend
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // métodos HTTP permitidos
				.allowedHeaders("*")
				.allowCredentials(true); // se precisar enviar cookies/autenticação
	}
}