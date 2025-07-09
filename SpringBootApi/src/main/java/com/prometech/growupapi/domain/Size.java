package com.prometech.growupapi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "size")
@Getter
@Setter
public class Size {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private BigDecimal minValue;
	
	private BigDecimal maxValue;
	
	private String imgUrl;
	
}
