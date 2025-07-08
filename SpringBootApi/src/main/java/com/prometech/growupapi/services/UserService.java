package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.dto.UserDTO;
import com.prometech.growupapi.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final  BCryptPasswordEncoder passwordEncoder;
	
	public UserService(UserRepository repository, BCryptPasswordEncoder passwordEncoder){
		this.userRepository = repository;
		this.passwordEncoder = passwordEncoder;
	}
	
	
	public User save(UserDTO userDTO){
		User user = new User();
		user.setName(userDTO.name);
		user.setEmail(userDTO.email);
		user.setPassword(passwordEncoder.encode(userDTO.password));
		user.setCpf(userDTO.cpf);
		user.setPhone(userDTO.phone);
		user.setBirthDate(userDTO.birthDate);
		user.setStatus(0);
		user.setType(0);
		
		return userRepository.save(user);
	}

	
	public List<User> findAll() {
		return userRepository.findAll();
	}
	
	
	public Optional<User> findById(Long id) {
		return userRepository.findById(id);
	}
	
	
	public void deleteById(Long id) {
		userRepository.deleteById(id);
	}

	public boolean authenticate(String email, String password) {
		return userRepository.findByEmail(email)
				       .map(user -> passwordEncoder.matches(password, user.getPassword()))
				       .orElse(false);
	}
	
	
	
}
