package com.prometech.growupapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record CnpjApiResponseDto (
		
		
		
		@JsonProperty("razao_social")
		String corporateName,
		
		@JsonProperty("nome_fantasia")
		String tradeName,
		
		@JsonProperty("estabelecimento")
		EstablishmentDto establishment
		
		
){
}
