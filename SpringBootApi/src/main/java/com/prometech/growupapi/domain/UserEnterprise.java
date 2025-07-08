package com.prometech.growupapi.domain;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "userEnterprise")
@Getter
@Setter
public class UserEnterprise {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	// Relação para User
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private User user;
	
	// Relação para Enterprise
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private Enterprise enterprise;

}
