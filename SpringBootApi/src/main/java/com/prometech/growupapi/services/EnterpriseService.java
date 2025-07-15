package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.Enterprise;
import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.dto.CnpjApiResponseDto;
import com.prometech.growupapi.dto.EnterpriseCreateDto;
import com.prometech.growupapi.dto.ResponseEnterpriseDto;
import com.prometech.growupapi.dto.SizeInvoicingRange;
import com.prometech.growupapi.repositories.EnterpriseRepository;
import com.prometech.growupapi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnterpriseService {
	
	@Autowired
	private EnterpriseRepository enterpriseRepository;
	
	@Value("${api.cnpj.token}")
	private String apiToken;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private SizeService sizeService;
	
	public void deleteById(Long id) {
		enterpriseRepository.deleteById(id);
	}
	
	public ResponseEnterpriseDto getById(Long id) {
		Enterprise enterprise = enterpriseRepository.getReferenceById(id);
		return mapToDto(enterprise);
	}
	
	public List<ResponseEnterpriseDto> getAllEntrisesByEmail(String email) {
		User user = userRepository.findByEmail(email)
				            .orElseThrow(() -> new RuntimeException("Não foi possível buscar o usuário por email"));
		List<Enterprise> enterprises = enterpriseRepository.findAllByUser(user);
		return enterprises.stream()
				       .map(this::mapToDto)
				       .collect(Collectors.toList());
	}
	
	public ResponseEnterpriseDto updateEnterprise(Long id, ResponseEnterpriseDto responseEnterpriseDto){
		
		Enterprise enterprise = enterpriseRepository.findById(id).orElseThrow(()->new RuntimeException("Não foi possivel encontrar empresa por id"));
		
		SizeInvoicingRange sizeInvoicingRange = new SizeInvoicingRange(responseEnterpriseDto.invoicing(), responseEnterpriseDto.invoicing());
		
		enterprise.setCnpj(responseEnterpriseDto.cnpj());
		enterprise.setCorporateName(responseEnterpriseDto.corporateName());
		enterprise.setTradeName(responseEnterpriseDto.tradeName());
		enterprise.setPhone(responseEnterpriseDto.phone());
		enterprise.setTaxRegime(responseEnterpriseDto.taxRegime());
		enterprise.setSector(responseEnterpriseDto.sector());
		enterprise.setRegion(responseEnterpriseDto.region());
		enterprise.setSize(sizeService.findByInvoicing(sizeInvoicingRange).orElseThrow(()->new RuntimeException("Não foi possivel buscar faixa de faturamento")));
		enterprise.setInvoicing(responseEnterpriseDto.invoicing());
		
		return this.mapToDto(enterpriseRepository.save(enterprise));
	}
	
	public ResponseEnterpriseDto createEnterpise(EnterpriseCreateDto enterpriseCreateDto) {
		User user = userRepository.findByEmail(enterpriseCreateDto.email())
				            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
		
		String url = "https://comercial.cnpj.ws/cnpj/" + this.cleanCnpj(enterpriseCreateDto.cnpj());
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("x_api_token", apiToken);
		headers.setAccept(Collections.singletonList(MediaType.ALL));
		HttpEntity<String> entity = new HttpEntity<>(headers);
		
		ResponseEntity<CnpjApiResponseDto> response = restTemplate.exchange(
				url, HttpMethod.GET, entity, CnpjApiResponseDto.class);
		
		Enterprise enterprise = getEnterprise(enterpriseCreateDto, response, user);
		Enterprise saved = enterpriseRepository.save(enterprise);
		
		return mapToDto(saved);
	}
	
	private Enterprise getEnterprise(EnterpriseCreateDto enterpriseCreateDto,
	                                 ResponseEntity<CnpjApiResponseDto> response,
	                                 User user) {
		CnpjApiResponseDto cnpjApiResponseDto = response.getBody();
		
		
		if (cnpjApiResponseDto == null) {
			throw new RuntimeException("Erro ao obter dados do CNPJ");
		}
		
		Enterprise enterprise = new Enterprise();
		enterprise.setCnpj(this.cleanCnpj(enterpriseCreateDto.cnpj()));
		enterprise.setCorporateName(cnpjApiResponseDto.corporateName());
		enterprise.setSector(cnpjApiResponseDto.establishment().mainActivity().sector());
		enterprise.setTradeName(cnpjApiResponseDto.tradeName());
		enterprise.setUser(user);
		enterprise.setEmail(cnpjApiResponseDto.establishment().email() == null ? "" : cnpjApiResponseDto.establishment().email());
		enterprise.setPhone(cnpjApiResponseDto.establishment().phone() == null ? "" : cnpjApiResponseDto.establishment().phone());
		enterprise.setRegion(cnpjApiResponseDto.establishment().state().region() == null ? "" : cnpjApiResponseDto.establishment().state().region());
		enterprise.setTaxRegime(
				cnpjApiResponseDto.establishment().taxRegime() == null || cnpjApiResponseDto.establishment().taxRegime().isEmpty()
						? ""
						: cnpjApiResponseDto.establishment().taxRegime().getFirst().TaxRegime());
		
		return enterprise;
	}
	
	private ResponseEnterpriseDto mapToDto(Enterprise enterprise) {
		return new ResponseEnterpriseDto(
				enterprise.getId(),
				enterprise.getCnpj(),
				enterprise.getCorporateName(),
				enterprise.getTradeName(),
				enterprise.getPhone(),
				enterprise.getEmail(),
				enterprise.getSize(),
				enterprise.getSector(),
				enterprise.getRegion(),
				enterprise.getInvoicing(),
				enterprise.getTaxRegime()
		);
	}
	
	private String cleanCnpj(String dirtyCnpj) {
		return dirtyCnpj.replaceAll("\\D", "");
	}
}
