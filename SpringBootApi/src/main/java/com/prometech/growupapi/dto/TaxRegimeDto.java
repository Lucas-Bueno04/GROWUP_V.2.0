package com.prometech.growupapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TaxRegimeDto(
		@JsonProperty("ano")
		Integer year,
		
		@JsonProperty("regime_tributario")
		String TaxRegime

) {
}
