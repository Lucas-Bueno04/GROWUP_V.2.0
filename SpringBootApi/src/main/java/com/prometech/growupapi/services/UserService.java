package com.prometech.growupapi.services;

import com.prometech.growupapi.config.SecurityConfig;
import com.prometech.growupapi.domain.Role;
import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.dto.CreateUserDto;
import com.prometech.growupapi.dto.LoginUserDto;
import com.prometech.growupapi.dto.RecoveryJwtTokenDto;
import com.prometech.growupapi.dto.RecoveryUserDto;
import com.prometech.growupapi.repositories.UserRepository;
import com.prometech.growupapi.security.JwtTokenService;
import com.prometech.growupapi.security.UserDetailsImpl;
import com.sun.jdi.PrimitiveValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtTokenService jwtTokenService;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private SecurityConfig securityConfig;
	
	public RecoveryJwtTokenDto authenticateUser (LoginUserDto loginUserDto){
		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(loginUserDto.email(), loginUserDto.password());
		
		Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		
		return new RecoveryJwtTokenDto(jwtTokenService.generateToken(userDetails));
	}
	
	public void createUser(CreateUserDto createUserDto){
		
		User newUser = new User();
		newUser.setName(createUserDto.name());
		newUser.setPassword(securityConfig.passwordEncoder().encode(createUserDto.password()));
		newUser.setRoles(List.of(Role.builder().name(createUserDto.role()).build()));
		
		userRepository.save(newUser);
		
	}
}
