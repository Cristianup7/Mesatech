package com.mesatech.bff.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class BffAuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        if (authentication == null) {
            result.put("authenticated", false);
            return ResponseEntity.ok(result);
        }

        result.put("authenticated", true);
        result.put("username", authentication.getName());
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        result.put("authorities", authorities);

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            result.put("issuer", jwt.getIssuer() != null ? jwt.getIssuer().toString() : null);
            result.put("subject", jwt.getSubject());
            result.put("audience", jwt.getAudience());
            result.put("claims", jwt.getClaims());
            result.put("expiresAt", jwt.getExpiresAt());
            result.put("issuedAt", jwt.getIssuedAt());
            result.put("roles", jwt.getClaimAsStringList("roles"));
            result.put("scope", jwt.getClaimAsString("scp"));
            result.put("name", jwt.getClaimAsString("name"));
            result.put("preferred_username", jwt.getClaimAsString("preferred_username"));
        }

        return ResponseEntity.ok(result);
    }
}
