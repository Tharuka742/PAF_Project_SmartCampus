package com.smartcampus.smart_campus_backend.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Security configuration for Smart Campus backend.
 *
 * - OAuth2 login via Google (OIDC)
 * - Stateless-style REST (session used only to hold OAuth2 principal)
 * - Role-based access via @PreAuthorize on controllers
 * - CORS configured for the React dev server
 *
 * Role assignment:
 *   Emails listed in ADMIN_EMAILS get ROLE_ADMIN; everyone else gets ROLE_USER.
 *   In production this would come from a User collection / claims service.
 */
@Configuration
@EnableMethodSecurity  // turns on @PreAuthorize support
public class SecurityConfig {

    // TODO: replace with your team members' Google emails for the demo
    private static final Set<String> ADMIN_EMAILS = Set.of(
            "admin@smartcampus.com",
            "kavinduwethmin@gmail.com"
    );

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsSource()))
        .csrf(csrf -> csrf.disable())

        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/", "/error", "/login/**", "/oauth2/**", "/public/**").permitAll()
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll()
        )

        .oauth2Login(oauth -> oauth
            .userInfoEndpoint(ui -> ui.oidcUserService(customOidcUserService()))
        )

        .exceptionHandling(ex -> ex
            .defaultAuthenticationEntryPointFor(
                new LoginUrlAuthenticationEntryPoint("/oauth2/authorization/google"),
                request -> !request.getRequestURI().startsWith("/api/")
            )
            .defaultAuthenticationEntryPointFor(
                (request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                },
                request -> request.getRequestURI().startsWith("/api/")
            )
        )

        .logout(logout -> logout.logoutSuccessUrl("/").permitAll());

    return http.build();
}

    /** Maps Google OIDC user → Spring Security principal with ROLE_USER or ROLE_ADMIN. */
    @Bean
    public OidcUserService customOidcUserService() {
        OidcUserService delegate = new OidcUserService();
        return new OidcUserService() {
            @Override
            public OidcUser loadUser(org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest req) {
                OidcUser oidcUser = delegate.loadUser(req);

                String email = oidcUser.getEmail();
                String role  = (email != null && ADMIN_EMAILS.contains(email.toLowerCase()))
                ? "ROLE_ADMIN" : "ROLE_USER";

                Collection<org.springframework.security.core.GrantedAuthority> authorities =
                        new ArrayList<>(oidcUser.getAuthorities());
                authorities.add(new SimpleGrantedAuthority(role));

                return new DefaultOidcUser(authorities, oidcUser.getIdToken(), oidcUser.getUserInfo(), "sub");
            }
        };
    }

    /** CORS policy — allow the React dev server to call the API with credentials. */
    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}