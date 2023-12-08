package com.twoyu.taskifybackend.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.val;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    private static final String SECRET_KEY = "v2eZTFbYPR8xB20rmzCzDhthLZZIOvtNloe41UHX5l0NWfdq0a1HBLPY4pz1CTV6";
    private static final long ACCESS_TOKEN_VALIDITY = (long) 1000 * 60 * 60 * 24 * 7;
    private final JwtParser jwtParser;
    public JwtUtil() {
        this.jwtParser = Jwts.parserBuilder().setSigningKey(getSignKey()).build();
    }


    public String createToken(String email){
        Claims claims = Jwts.claims().setSubject(email);
        long dateTokenCreated = System.currentTimeMillis();
        Date tokenValidity = new Date(dateTokenCreated + ACCESS_TOKEN_VALIDITY);
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(tokenValidity)
                .signWith(getSignKey())
                .compact();
    }

    private Claims parseJwtClaims(String token){
        return jwtParser.parseClaimsJws(token).getBody();
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        Claims claims = parseJwtClaims(token);
        return claimsResolver.apply(claims);
    }



    private Key getSignKey(){
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        val username = extractUserName(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
