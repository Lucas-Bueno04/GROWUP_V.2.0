package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.Size;
import com.prometech.growupapi.dto.SizeDTO;
import com.prometech.growupapi.repositories.SizeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class SizeService {

	private final SizeRepository repository;
	
	public SizeService(SizeRepository repository){
		this.repository = repository;
	}
	
	public Size save(SizeDTO sizeDTO){
		Size size = new Size();
		size.setName(sizeDTO.name);
		size.setMinValue(sizeDTO.minValue);
		size.setMaxValue(sizeDTO.maxValue);
		return repository.save(size);
		
	}
	
	public List<Size> findAll(){
		return repository.findAll();
	}
	
	public Optional<Size> findById(Long id){
		return  repository.findById(id);
	}
	
	public void deleteById(Long id){
		repository.deleteById(id);
	}
	
	public Optional<Size> findByInvoicing(BigDecimal invoicing1, BigDecimal invoicing2){
		return  repository.findByMinValueLessThanEqualAndMaxValueGreaterThanEqual(invoicing1, invoicing2);
	}
	
}
