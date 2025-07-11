package com.prometech.growupapi.dto;

import java.math.BigDecimal;

public record SizeDTO(
		String name,
		BigDecimal minValue,
		BigDecimal maxValue
) {
}