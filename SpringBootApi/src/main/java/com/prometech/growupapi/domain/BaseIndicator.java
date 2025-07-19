package com.prometech.growupapi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@MappedSuperclass
@Getter
@Setter
public class BaseIndicator {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String cod;
	
	private String name;
	
	private String description;
	
	private String formula;
	
	private String unity;
	
	@Column(name = "better_when")
	private String betterWhen;
	
}
