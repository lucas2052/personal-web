package com.luca.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                // owner-only: check current login
                .requestMatchers("/api/auth/me").authenticated()
                // public write: anyone can comment on a blog post
                .requestMatchers(HttpMethod.POST, "/api/posts/*/comments").permitAll()
                // public reads (blog, portfolio, images, comments, profile, links)
                .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                // everything else (create/update/delete posts, images, profile, links) = owner only
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            // allow the H2 dev console to render in a frame
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));
        return http.build();
    }

    /** Single owner account. TODO: change the password and move it to config / env. */
    @Bean
    UserDetailsService userDetailsService() {
        var owner = User.withUsername("owner")
                .password("{noop}changeme")
                .roles("OWNER")
                .build();
        return new InMemoryUserDetailsManager(owner);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
