package com.prometech.growupapi.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;


@Entity
@Table(name = "user")
@Getter
@Setter
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String name;
	
	@Column(unique = true, nullable = false)
	private String email;
	
	@Column(nullable = false)
	private String password;
	
	@Column(length = 11,unique = true)
	private String cpf;
	
	private String phone;
	
	private LocalDate birthDate;
	
	private Integer status;
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
	@JoinTable(name = "users_roles",
		joinColumns = @JoinColumn(name = "user_id"),
					  inverseJoinColumns = @JoinColumn(name = "role_id")
	)
	private List<Role> roles;
	

}
