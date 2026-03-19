package com.ella.truckingapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/users/**").permitAll() // allow creating users
                        .requestMatchers("/drivers/**").hasRole("ADMIN")
                        .requestMatchers("/jobs/**").authenticated()
                        .anyRequest().authenticated()
                )
                .httpBasic(); // simple login popup

        return http.build();
    }
}