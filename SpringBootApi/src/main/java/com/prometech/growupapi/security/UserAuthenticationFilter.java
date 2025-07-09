package com.prometech.growupapi.security;

import com.prometech.growupapi.config.SecurityConfig;
import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.query.NativeQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.lang.reflect.Array;
import java.net.Authenticator;
import java.util.Arrays;

@Component
public class UserAuthenticationFilter extends OncePerRequestFilter {
	
	@Autowired
	private JwtTokenService jwtTokenService;
	
	@Autowired
	private UserRepository userRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
	
		if(checkIfEndpointIsNotPublic(request)){
			String token = recoveryToken(request);
			if (token!=null){
				String subject = jwtTokenService.getSubjetFromToken(token);
				User user = userRepository.findByEmail(subject).get();
				UserDetailsImpl userDetails = new UserDetailsImpl(user);
				
				Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());
				
				SecurityContextHolder.getContext().setAuthentication(authentication);
				
			}else{
				throw  new RuntimeException("O token está ausente.");
			}
		}
		
		filterChain.doFilter(request, response);
	}
	
	private String recoveryToken(HttpServletRequest request){
		
		String authorizationHeader = request.getHeader("Authorization");
		
		if(authorizationHeader!=null){
			return authorizationHeader.replace("Bearer ", "");
		}
		return  null;
	}
	
	private boolean checkIfEndpointIsNotPublic(HttpServletRequest request){
		
		String requestURI = request.getRequestURI();
		
		return !Arrays.asList(SecurityConfig.ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED).contains(requestURI);
	}
}

