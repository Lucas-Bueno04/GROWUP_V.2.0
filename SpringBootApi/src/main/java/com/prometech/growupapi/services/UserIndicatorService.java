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
	

	public void  create(Long userId, IndicatorRequestDto dto) {
		if (userIndicatorRepository.existsByCodAndUserId(dto.cod(), userId)) {
			throw new IllegalArgumentException("Código já existe para este usuário");
		}
		
		User user = userRepository.findById(userId)
				            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
		
		UserIndicator indicator = indicatorMapper.toUserEntity(dto, user);
		UserIndicator saved = userIndicatorRepository.save(indicator);
		
		indicatorMapper.toDto(saved);
	}
	
	public List<IndicatorResponseDto> findByUserId(Long userId) {
		return userIndicatorRepository.findByUserId(userId).stream()
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
