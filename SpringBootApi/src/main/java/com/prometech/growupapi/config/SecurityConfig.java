package com.prometech.growupapi.config;
import com.prometech.growupapi.security.UserAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private UserAuthenticationFilter userAuthenticationFilter;
	
	public static final String [] ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED = {
			"/api/v1/auth",
			"/api/v1/users",
			"/api/v1/auth/validate"
	};
	
	public static final String [] ENDPOINTS_WITH_AUTHENTICATION_REQUIRED = {
			"/api/v1/users/**"
	
	
	};
	
	public static  final String [] ENDPOINTS_CUSTOMER ={
	
	};
	
	public  static  final String [] ENDPOINTS_ADMIN = {
	
	};
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws  Exception{
		return httpSecurity.csrf().disable()
				       .cors(Customizer.withDefaults())
				       .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				       .and().authorizeHttpRequests() // Habilita a autorização para as requisições HTTP
				       .requestMatchers(ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED).permitAll()
				       .requestMatchers(ENDPOINTS_WITH_AUTHENTICATION_REQUIRED).authenticated()
				       .requestMatchers(ENDPOINTS_ADMIN).hasRole("ADMINISTRATOR") // Repare que não é necessário colocar "ROLE" antes do nome, como fizemos na definição das roles
				       .requestMatchers(ENDPOINTS_CUSTOMER).hasRole("CUSTOMER")
				       .anyRequest().denyAll()
				       // Adiciona o filtro de autenticação de usuário que criamos, antes do filtro de segurança padrão do Spring Security
				       .and().addFilterBefore(userAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				       .build();
	}
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
		return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder(){
		return  new BCryptPasswordEncoder();
	}
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:5173")); // sua origem frontend
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
		configuration.setAllowCredentials(true); // se for usar cookies, senão pode remover
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
	

}

