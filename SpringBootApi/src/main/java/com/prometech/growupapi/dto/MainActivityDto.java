package com.prometech.growupapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MainActivityDto (
		
		@JsonProperty("id")
		String id,
		
		@JsonProperty("descricao")
		String sector
){
}
