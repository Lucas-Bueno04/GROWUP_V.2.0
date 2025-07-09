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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private UserAuthenticationFilter userAuthenticationFilter;
	
	public static final String [] ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED = {
			"/auth/login",
			"auth/register"
	};
	
	public static final String [] ENDPOINTS_WITH_AUTHENTICATION_REQUIRED = {
	
	};
	
	public static  final String [] ENDPOINTS_CUSTOMER ={
	
	};
	
	public  static  final String [] ENDPOINTS_ADMIN = {
	
	};
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws  Exception{
		return httpSecurity.csrf().disable()
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

}

