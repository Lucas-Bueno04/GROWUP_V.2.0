package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.AdminIndicator;
import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.domain.UserIndicator;
import com.prometech.growupapi.dto.IndicatorRequestDto;
import com.prometech.growupapi.dto.IndicatorResponseDto;
import com.prometech.growupapi.repositories.AdminIndicatorRepository;
import com.prometech.growupapi.repositories.UserIndicatorRepository;
import com.prometech.growupapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminIndicatorService {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	AdminIndicatorRepository adminIndicatorRepository;
	
	@Autowired
	IndicatorMapper indicatorMapper;
	


	public void create(IndicatorRequestDto dto) {
		if (adminIndicatorRepository.existsByCod(dto.cod())) {
			throw new IllegalArgumentException("Código já existe");
		}
		
		AdminIndicator indicator = indicatorMapper.toAdminEntity(dto);
		AdminIndicator saved = adminIndicatorRepository.save(indicator);
		indicatorMapper.toDto(saved);
	}
	
	public List<IndicatorResponseDto> findAll() {
		return adminIndicatorRepository.findAll().stream()
				       .map(indicatorMapper::toDto)
				       .collect(Collectors.toList());
	}
	
	public Optional<IndicatorResponseDto> findById(Long id) {
		return adminIndicatorRepository.findById(id)
				       .map(indicatorMapper::toDto);
	}
	
	public void delete(Long id) {
		adminIndicatorRepository.deleteById(id);
	}


}
