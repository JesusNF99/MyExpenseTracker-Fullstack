package com.praject.expenselist.controller;

import com.praject.expenselist.config.JwUtils;
import com.praject.expenselist.model.User;
import com.praject.expenselist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwUtils jwUtils;

    //Registro y Login

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser (@RequestBody User user) {
        //1. ¿Ya existe el nombre de usuario?
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        //2. Ciframos La contraseña antes de guardarla
        String cipheredPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(cipheredPassword);

        //3. Guardamos al usuario en la base de datos
        userRepository.save(user);

        return ResponseEntity.ok("Usuario registrado con éxito");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {

        // 1. El "Juez" valida usuario y contraseña
        // Si los datos son falsos, esta línea lanzará una excepción automáticamente
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // 2. Si llegamos aquí, el login es correcto.
        // Informamos a Spring de quién es el usuario actual.
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. ¡Fabricamos el Pasaporte (Token)!
        String jwt = jwUtils.generateToken(authentication);

        // 4. Devolvemos el Token al cliente
        return ResponseEntity.ok(jwt);
    }

}
