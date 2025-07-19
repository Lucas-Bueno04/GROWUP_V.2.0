package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.domain.UserIndicator;
import com.prometech.growupapi.dto.IndicatorRequestDto;
import com.prometech.growupapi.dto.IndicatorResponseDto;
import com.prometech.growupapi.repositories.AdminIndicatorRepository;
import com.prometech.growupapi.repositories.UserIndicatorRepository;
import com.prometech.growupapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserIndicatorService {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserIndicatorRepository userIndicatorRepository;
	
	@Autowired
	IndicatorMapper indicatorMapper;
	

	public void  create(String email, IndicatorRequestDto dto) {
		
		User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("Erro ao buscar usuario"));
		
		Long userId = user.getId();
		
		if (userIndicatorRepository.existsByCodAndUserId(dto.cod(), userId)) {
			throw new IllegalArgumentException("Código já existe para este usuário");
		}
		
		UserIndicator indicator = indicatorMapper.toUserEntity(dto, user);
		UserIndicator saved = userIndicatorRepository.save(indicator);
		
		indicatorMapper.toDto(saved);
	}
	
	public List<IndicatorResponseDto> findByUserId(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("Erro ao encontrar usuario"));
		
		return userIndicatorRepository.findByUserId(user.getId()).stream()
				       .map(indicatorMapper::toDto)
				       .collect(Collectors.toList());
	}
	
	public Optional<IndicatorResponseDto> findById(Long id) {
		return userIndicatorRepository.findById(id)
				       .map(indicatorMapper::toDto);
	}
	
	public void delete(Long id) {
		userIndicatorRepository.deleteById(id);
	}
}
