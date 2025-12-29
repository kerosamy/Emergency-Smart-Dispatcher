package com.example.esd_backend;

import com.example.esd_backend.model.Osta;
import com.example.esd_backend.service.OstaRedisService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
@Component
public class RedisTestRunner implements CommandLineRunner {

    private final OstaRedisService service;

    public RedisTestRunner(OstaRedisService service) {
        this.service = service;
    }

    @Override
    public void run(String... args) {

        // Initial mock data
        service.saveOsta(new Osta(1L, "John", 120));
        service.saveOsta(new Osta(2L, "Alice", 150));

        System.out.println("Initial data:");
        System.out.println(service.getOsta(1L));
        System.out.println(service.getOsta(2L));

        // Overwrite previous entry (John)
        service.saveOsta(new Osta(1L, "John Updated", 200));

        // Add more mock users
        service.saveOsta(new Osta(3L, "Bob", 90));
        service.saveOsta(new Osta(4L, "Eva", 180));

        // Edit an existing one (Alice)
        Osta alice = service.getOsta(2L);
        alice.setScore(160);
        service.saveOsta(alice);

        System.out.println("\nAfter updates & new entries:");
        System.out.println(service.getOsta(1L)); // John Updated
        System.out.println(service.getOsta(2L)); // Alice updated
        System.out.println(service.getOsta(3L)); // Bob
        System.out.println(service.getOsta(4L)); // Eva
    }
}
