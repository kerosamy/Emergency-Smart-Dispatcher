package com.example.esd_backend.service;

import com.example.esd_backend.dto.VehicleLocationDto;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    private final StringRedisTemplate redisTemplate;

    public RedisService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void save(VehicleLocationDto dto) {
        String redisKey = "id:" + dto.getId();
        String posValue = dto.getLatitude() + "," + dto.getLongitude();

        int expireTime = 5;
        redisTemplate.opsForValue()
                .set(redisKey, posValue, expireTime, TimeUnit.SECONDS);
    }

    public List<VehicleLocationDto> getAllVehicles() {
        Set<String> keys = redisTemplate.keys("id:*");
        List<VehicleLocationDto> locations = new ArrayList<>();

        if (keys != null) {
            for (String key : keys) {
                String vehicleId = key.split(":")[1];
                String posValue = (String) redisTemplate.opsForValue().get(key);

                if (posValue != null) {
                    String[] coords = posValue.split(",");
                    locations.add(new VehicleLocationDto(
                            Long.parseLong(vehicleId),
                            Double.parseDouble(coords[0]), // latitude
                            Double.parseDouble(coords[1])  // longitude
                    ));
                }
            }
        }
        return locations;
    }


}
