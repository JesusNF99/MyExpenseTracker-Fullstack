package com.praject.expenselist.config;


import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component // Para que Spring pueda inyectar esta clase donde la necesitemos
public class JwUtils {

    // 1. La frase secreta (Nuestra "tinta" especial que nadie más tiene)
    // Debe ser larga y aleatoria. Solo tu servidor la conoce.
    private String jwtSecret = "mi_clave_super_secreta_y_muy_larga_para_que_sea_segura_123456";

    // 2. El tiempo de vida (En milisegundos)
    // 86,400,000 ms = 24 horas. Después de esto, la "pulsera" ya no vale.
    private int jwtExpirationMs = 86400000;

    // 3. Method para transformar el String en una Llave Maestra matemática
    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    //Generamos el token
    public String generateToken(Authentication authentication) {
        // Obtenemos el nombre del usuario desde el objeto de autenticación
        String username = authentication.getName();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)           // El "dueño" del token
                .issuedAt(now)               // Fecha de creación
                .expiration(expiryDate)      // Fecha de caducidad
                .signWith(key())             // Firma digital con nuestra Key
                .compact();                  // Construye el String final
    }

    //Obtener usuario del Token
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key()) // Verificamos la firma con nuestra llave
                .build()
                .parseSignedClaims(token)      // "Abrimos" el contenido
                .getPayload()                  // Accedemos a los datos (claims)
                .getSubject();                 // Recuperamos el nombre de usuario
    }

    //Validar el Token - comprobar si el token es auténtico, si no ha caducado y si no ha sido manipulado.
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parse(authToken); // Si el token falla (caducado, firma falsa, etc), lanza una excepción
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Aquí podrías loguear el error específico (ExpiredJwtException, etc.)
            return false;
        }
    }






}
