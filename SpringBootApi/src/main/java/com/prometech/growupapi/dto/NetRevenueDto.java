package com.prometech.growupapi.dto;

import java.math.BigDecimal;

public record NetRevenueDto(
		BigDecimal budgeted,
		BigDecimal carried
) {
}
