package com.prometech.growupapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StateDto(
		
		@JsonProperty("id")
		String id,
		
		@JsonProperty("nome")
		String name,
		
		@JsonProperty("sigla")
		String region,
		
		@JsonProperty("ibge_id")
		String ibgeId
) {
}
