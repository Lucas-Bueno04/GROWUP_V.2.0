package com.prometech.growupapi.dto;

import java.math.BigDecimal;

public record AccountValueDto(
		Long accountId,
		String valueType,
		BigDecimal value
) {
}
