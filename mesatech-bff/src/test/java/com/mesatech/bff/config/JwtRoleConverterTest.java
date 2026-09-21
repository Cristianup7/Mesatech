package com.mesatech.bff.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtRoleConverterTest {

    private final JwtRoleConverter converter = new JwtRoleConverter();

    @Test
    void convierteRolesYScopesEnAuthorities() {
        Jwt jwt = jwt(Map.of(
                "roles", List.of("Administrador", "Operador"),
                "scp", "read write"));

        Collection<GrantedAuthority> authorities = converter.convert(jwt);
        List<String> names = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        assertEquals(4, names.size());
        assertTrue(names.containsAll(List.of(
                "ROLE_Administrador",
                "ROLE_Operador",
                "SCOPE_read",
                "SCOPE_write")));
    }

    @Test
    void devuelveColeccionVaciaSinRolesNiScopes() {
        Jwt jwt = jwt(Map.of("sub", "usuario"));

        assertTrue(converter.convert(jwt).isEmpty());
    }

    @Test
    void ignoraScopeVacio() {
        Jwt jwt = jwt(Map.of("scp", "   "));

        assertTrue(converter.convert(jwt).isEmpty());
    }

    private static Jwt jwt(Map<String, Object> claims) {
        return new Jwt(
                "token",
                Instant.EPOCH,
                Instant.EPOCH.plusSeconds(3600),
                Map.of("alg", "none"),
                claims);
    }
}
