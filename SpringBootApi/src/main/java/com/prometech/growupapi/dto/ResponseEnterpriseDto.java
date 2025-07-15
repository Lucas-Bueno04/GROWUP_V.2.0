package com.prometech.growupapi.dto;

import com.prometech.growupapi.domain.Size;

import java.math.BigDecimal;

public record ResponseEnterpriseDto(
		
		Long id,
		String cnpj,
		String corporateName,
		String tradeName,
		String phone,
		String email,
		Size size,
		String sector,
		String region,
		BigDecimal invoicing,
		String taxRegime
) {
}
