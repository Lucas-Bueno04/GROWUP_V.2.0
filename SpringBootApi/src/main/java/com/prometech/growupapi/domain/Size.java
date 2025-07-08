package com.prometech.growupapi.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "size") // nome da tabela no banco de dados
@Getter
@Setter
public class Size {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, unique = true)
	private String name;
	
	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal minValue;
	
	@Column( nullable = false, precision = 15, scale = 2)
	private BigDecimal maxValue;
}