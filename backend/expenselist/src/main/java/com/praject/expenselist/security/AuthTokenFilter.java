package com.praject.expenselist.security;

import com.praject.expenselist.config.JwUtils;
import com.praject.expenselist.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwUtils jwUtils;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            //1. Intentar obtener el token de la cabecera
            String jwt = parseJwt(request);

            //2. Si el token existe y es válido
            if (jwt != null && jwUtils.validateJwtToken(jwt)) {
                //2.1. Extraemos del nombre de usuario del token
                String username = jwUtils.getUserNameFromJwtToken(jwt);
                //2.2. Cargamos el usuario en la base de datos
                UserDetails userdetails = userDetailsService.loadUserByUsername(username);
                //2.3. Creamos el "DNI" de Spring Security (Authentication)
                //Recibe: el usuario, la contraseña (null por seguridad) y los permisos (authorities)
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userdetails, null, userdetails.getAuthorities());
                //2.4. Añadimos detalles técnicos de la petición (como la IP o sesión)
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                //2.5. Guardamos al usuario en el contexto de Spring
                SecurityContextHolder.getContext().setAuthentication(authentication);


            }
        } catch (Exception e) {
            System.out.println("Error " + e.getMessage());

        }

        //3. ¡Muy importante! Dejar que la petición siga su camino hacia el Controller
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        // 1. Buscamos la cabecera llamada "Authorization"
        String headerAuth = request.getHeader("Authorization");

        // 2. Comprobamos si existe y si empieza por "Bearer "
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            // 3. Recortamos los primeros 7 caracteres ("Bearer ")
            // y devolvemos solo el token puro.
            return headerAuth.substring(7);
        }

        return null;
    }


}
