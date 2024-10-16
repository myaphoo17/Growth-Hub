package com.E_Learnig.System.Component;

import java.security.SecureRandom;

public class KeyGenerater {

    public static void main(String[] args) {
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[64];
        random.nextBytes(keyBytes);

        // Convert byte array to hexadecimal string
        StringBuilder sb = new StringBuilder();
        for (byte b : keyBytes) {
            sb.append(String.format("%02x", b));
        }
        String generatedKey = sb.toString();
    }
}
