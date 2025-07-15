package com.prometech.growupapi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Entity
@Table(name = "enterprise")
@Getter
@Setter
public class Enterprise {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String Cnpj;
	
	@Column(nullable = false)
	private String corporateName;
	
	private  String tradeName;
	
	private String phone;
	
	private String email;
	
	@ManyToOne()
	@JoinColumn(referencedColumnName = "id")
	private Size size;
	
	private String taxRegime;
	
	private String sector;
	
	private String region;
	
	private BigDecimal invoicing;
	
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private User user;
	
}
