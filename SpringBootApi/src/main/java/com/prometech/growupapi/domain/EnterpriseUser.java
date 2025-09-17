package com.prometech.growupapi.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "enterprise_user")
@Getter
@Setter
public class EnterpriseUser {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(optional = false)
	@JoinColumn(name = "enterprise_id", referencedColumnName = "id")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Enterprise enterprise;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private User user;
	
	
}
