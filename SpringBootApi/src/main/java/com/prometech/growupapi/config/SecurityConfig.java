package com.prometech.growupapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

@Bean
public BCryptPasswordEncoder passwordEncoder() {
	return new BCryptPasswordEncoder();
}

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	http
			.csrf().disable()  // Desativa CSRF (necessário para APIs REST funcionarem com POST)
			.authorizeHttpRequests(auth -> auth
					                               .requestMatchers("/auth/register", "/auth/login").permitAll()  // Libera os endpoints de autenticação
					                               .anyRequest().authenticated()  // Protege o resto
			)
			.httpBasic(); // Ou use .formLogin().disable() se não quiser login web
	
	return http.build();
}
}
