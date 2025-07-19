package com.prometech.growupapi.dto;

import jakarta.persistence.Column;

public record IndicatorRequestDto(
		String cod,
		
		String name,
		
		String description,
		
		String formula,
		
		String unity,
		
		String betterWhen
) {
}
