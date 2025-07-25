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
			"/api/v1/users/**",
			"/api/v1/users/by-email/**",
			"/api/v1/users/update/**",
			"/api/v1/users/update-password/**",
			"/api/v1/users/delete/**",
			"api/v1/size",
			"api/v1/size/by-invoicing",
			"/api/v1/group",
			"/api/v1/account",
			"api/v1/enterprise",
			"/api/v1/enterprise/**",
			"/api/v1/enterprise/create/**",
			"/api/v1/enterprise/update/**",
			"/api/v1/budget/create/**",
			"/api/v1/budget/**",
			"/api/v1/budget/update/**",
			"/api/v1/budget/by-email-id/**",
			"/api/v1/budget/by-id/**",
			"/api/v1/budget/by-email/**",
			"/api/v1/budget/delete/**",
			"/api/v1/budget/filter-months/**",
			"/api/v1/budget/analyze/**",
			"/api/v1/analist/**",
			"/api/v1/analist/test/**",
			"/api/v1/indicator/user-indicator/**",
			"/api/v1/indicator/user-indicator/create",
			"/api/v1/indicator/user-indicator/create/**",
			"/api/v1/indicator/user-indicator/by-user-id/**",
			"/api/v1/indicator/user-indicator/by-id/**",
			"/api/v1/indicator/user-indicator/delete/**",
			"/api/v1/indicator/admin-indicator",
			"/api/v1/indicator/admin-indicator/by-id/**",
			"/api/v1/analist",
			"/api/v1/analist/**",
			"/api/v1/analist/group-sum/months/**",
			"/api/v1/analist/account-sum/months/**",
			"/api/v1/analist/group-average/months/**",
			"/api/v1/analist/account-average/months/**",
			"/api/v1/analist/net-revenue/month/**",
			"/api/v1/analist/net-revenue/budget/**",
			"/api/v1/analist/formula/evaluate/**",
			
	};
	
	public static  final String [] ENDPOINTS_CUSTOMER ={
	
	};
	
	public  static  final String [] ENDPOINTS_ADMIN = {
			"/api/v1/size/create/**",
			"/api/v1/size/update/**",
			"/api/v1/size/delete/**",
			"/api/v1/group/create/**",
			"/api/v1/group/update/**",
			"/api/v1/group/delete/**",
			"/api/v1/account/update/**",
			"/api/v1/account/delete/**",
			"/api/v1/account/create/**",
			"/api/v1/indicator/admin-indicator/create/**",
			"/api/v1/indicator/admin-indicator/delete/**",
			"/api/v1/users/all/**"
		
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
		
		// Aqui está o ponto chave:
		configuration.addAllowedOriginPattern("*"); // aceita qualquer origem
		configuration.setAllowCredentials(true);    // permite envio de cookies/autorização
		
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		
		return source;
	}
	

}

