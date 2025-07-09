package com.prometech.growupapi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "enterprise")
@Getter
@Setter
public class Enterprise {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String corporateName;
	
	private  String tradeName;
	
	private String phone;
	
	@Column(unique = true)
	private String email;
	
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private Size size;
	
	private String taxRegime;
	
	private String sector;
	
	private String region;
	
	@Column(nullable = false)
	private BigDecimal invoicing;
	
	
}
