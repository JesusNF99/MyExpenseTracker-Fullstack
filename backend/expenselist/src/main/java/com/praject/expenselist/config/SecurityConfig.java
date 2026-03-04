package com.praject.expenselist.config;

import com.praject.expenselist.security.AuthTokenFilter;

import com.praject.expenselist.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;


import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired //Esto antes era public AuthTokenFilter authenticationJwtTokenFilter() {return new AuthTokenFilter();} Y estaba dando errores al acceder a la web
    private AuthTokenFilter authenticationJwtTokenFilter;


    //Here goes the @Bean DaoAuthenticationManager, however for some reason I cannot explain
    //the IDE doesn't recognize the setUserDetailsService() method. Thankfully, SpringBoot y smart enough
    //to do the same just by having a passwordEncoder and userDetailsService

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Auth: Registro y Login
                        .requestMatchers("/api/auth/**").permitAll()
                        // 2. Swagger / OpenAPI: Documentación
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        // 3. Everything else: Requires Token
                        .anyRequest().authenticated()
                );

        //Solo dejamos nuestro portero personalizado
        http.addFilterBefore(authenticationJwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
