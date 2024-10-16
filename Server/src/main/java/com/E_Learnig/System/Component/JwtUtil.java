package com.E_Learnig.System.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey;

    public String getSecretKey() {
        return secretKey;
    }

    public String createToken(String staffId) {
        // Logic to create a JWT token using the staffId
        return Jwts.builder()
                .setSubject(staffId)
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
                .compact();
    }
}
