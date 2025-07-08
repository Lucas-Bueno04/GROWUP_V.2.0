package com.prometech.growupapi.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
	
	private String tradeName;
	
	private String phone;
	
	private String email;
	
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private Size size;
	
	private String taxRegime;
	
	private String sector;
	
	private String region;
	
	@Column(nullable = false, precision = 15, scale = 2)
	private BigDecimal invoicing;
}
