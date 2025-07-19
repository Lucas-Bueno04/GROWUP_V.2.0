package com.prometech.growupapi.dto;

import java.math.BigDecimal;

public record FormulaResultDto(
		BigDecimal budgetedResult,
		BigDecimal carriedResult
) {
}
