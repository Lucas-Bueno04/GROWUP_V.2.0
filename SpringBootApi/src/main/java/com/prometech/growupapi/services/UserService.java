package com.prometech.growupapi.services;

import com.prometech.growupapi.config.SecurityConfig;
import com.prometech.growupapi.domain.Role;
import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.dto.*;
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
import java.util.Optional;

@Service
public class UserService {
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtTokenService jwtTokenService;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private   SecurityConfig securityConfig;
	
	public RecoveryJwtTokenDto authenticateUser (LoginUserDto loginUserDto){
		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(loginUserDto.email(), loginUserDto.password());
		
		Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		
		return new RecoveryJwtTokenDto(jwtTokenService.generateToken(userDetails));
	}
	
	public void createUser(CreateUserDto createUserDto){
		
		User newUser = new User();
		newUser.setName(createUserDto.name());
		newUser.setEmail(createUserDto.email());
		newUser.setPassword(securityConfig.passwordEncoder().encode(createUserDto.password()));
		newUser.setRoles(List.of(Role.builder().name(createUserDto.role()).build()));
		
		userRepository.save(newUser);
		
	}

	public String getNameByEmail(String email) {
		User user = userRepository.findByEmail(email)
				            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + email));
		
		return user.getName();
	}
	
	public UserDto getUserByEmail (String email) {
		User user = userRepository.findByEmail(email)
				            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + email));
		
		return new UserDto(user.getId(), user.getName(),user.getEmail(),user.getCpf(), user.getPhone(), user.getBirthDate());
	}
	
	public User getUserEntityByEmail(String email){
		
		return userRepository.findByEmail(email)
				            .orElseThrow( ()-> new RuntimeException("Usuario não encontrado com email !"));
	}

	public UserDto updateUser(UserDto userDto) {
		// Busca o usuário existente pelo id
		User user = userRepository.findById(userDto.id())
				            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + userDto.id()));
		
		// Atualiza os campos (exceto a senha)
		user.setName(userDto.name());
		user.setEmail(userDto.email());
		user.setCpf(userDto.cpf());
		user.setPhone(userDto.phone());
		user.setBirthDate(userDto.birthDate());
		
		// Salva as alterações
		user = userRepository.save(user);
		
		// Retorna o DTO atualizado (pode usar um método converter para DTO)
		return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getCpf(), user.getPhone(), user.getBirthDate());
	}

	public void updatePasswordByEmail(String email, String newPassword) {
		User user = userRepository.findByEmail(email)
				            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + email));
		
		
		user.setPassword(securityConfig.passwordEncoder().encode(newPassword));
		
		userRepository.save(user);
	}
	
	public void delete(String email){
		User user = userRepository.findByEmail(email)
				            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com email: " + email));
		
		userRepository.delete(user);
	}
	public List<UserDto> getAllUsers() {
		List<User> users = userRepository.findAll();
		return users.stream()
				       .map(user -> new UserDto(
						       user.getId(),
						       user.getName(),
						       user.getEmail(),
						       user.getCpf(),
						       user.getPhone(),
						       user.getBirthDate()))
				       .toList();
	}
	
}
