package com.prometech.growupapi.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JwtTokenService {
	
	private static final String SECRET_KEY = "dd3b0228d858c0d4033d6a4c34b655cb";
	private static final String ISSUER = "prometech_growup_api";
	
	public String generateToken(UserDetailsImpl user){
		
		try {
			Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
			List<String> roles = user.getAuthorities().stream()
					                     .map(GrantedAuthority::getAuthority)
					                     .toList();
			
			return JWT.create()
					       .withIssuer(ISSUER)
					       .withIssuedAt(creationDate())
					       .withExpiresAt(expirationDate())
					       .withSubject(user.getUsername())
					       .withClaim("roles", roles)
					       .sign(algorithm);
					       
		}catch (JWTCreationException exception){
			throw  new JWTCreationException("Erro ao gerar token.", exception);
		}
	}
	public String getSubjetFromToken(String token){
		try{
			Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
			return JWT.require(algorithm)
					       .withIssuer(ISSUER)
					       .build()
					       .verify(token)
					       .getSubject();
		}catch (JWTVerificationException exception){
			throw  new JWTVerificationException("Token inválido ou expirado");
		}
	}
	
	private Instant creationDate(){
		return ZonedDateTime.now().toInstant();
	}
	
	private Instant expirationDate(){
		return ZonedDateTime.now().plusHours(4).toInstant();
	}
}
