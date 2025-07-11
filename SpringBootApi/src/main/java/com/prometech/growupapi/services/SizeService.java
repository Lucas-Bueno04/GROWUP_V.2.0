package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.Size;
import com.prometech.growupapi.dto.SizeDTO;
import com.prometech.growupapi.dto.SizeInvoicingRange;
import com.prometech.growupapi.repositories.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.classfile.Opcode;
import java.util.List;
import java.util.Optional;

@Service
public class SizeService {

	@Autowired
	private SizeRepository sizeRepository;
	
	public void creteSize(SizeDTO sizeDTO){
		Size newSize = new Size();
		newSize.setName(sizeDTO.name());
		newSize.setMinValue(sizeDTO.minValue());
		newSize.setMaxValue(sizeDTO.maxValue());
		
		sizeRepository.save(newSize);
	}
	
	public Optional<Size> findByInvoicing(SizeInvoicingRange sizeInvoicingRange){
		return sizeRepository.findByMinValueLessThanEqualAndMaxValueGreaterThanEqual(sizeInvoicingRange.invoicing1(),sizeInvoicingRange.invoicing1());
		
	}

	public List<Size> findAll() {
		return sizeRepository.findAll();
	}
	
	public void updateSize(Long id, SizeDTO sizeDTO){
		
		
		Size size = sizeRepository.findById(id)
					            .orElseThrow(() -> new RuntimeException("Size not found"));
		size.setName(sizeDTO.name());
		size.setMinValue(sizeDTO.minValue());
		size.setMaxValue(sizeDTO.maxValue());
			
		sizeRepository.save(size);
		
	}
	
	public void deleteSize(Long id){
		Size size = sizeRepository.findById(id).orElseThrow(()->new RuntimeException("Size not found"));
		sizeRepository.delete(size);
	}

}
