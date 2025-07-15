package com.prometech.growupapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record EstablishmentDto(
		
		@JsonProperty("telefone1")
		String phone,
		
		@JsonProperty("email")
		String email,
		
		@JsonProperty("atividade_principal")
		MainActivityDto mainActivity,
		
		@JsonProperty("estado")
		StateDto state,
		
		@JsonProperty("regimes_tributarios")
		List<TaxRegimeDto> taxRegime
) {
}
