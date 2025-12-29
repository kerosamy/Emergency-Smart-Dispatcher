package com.example.esd_backend.service;

import com.example.esd_backend.model.Osta;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class OstaRedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public OstaRedisService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveOsta(Osta osta) {
        redisTemplate.opsForValue().set("osta:" + osta.getId(), osta);
    }

    public Osta getOsta(Long id) {
        return (Osta) redisTemplate.opsForValue().get("osta:" + id);
    }
}
