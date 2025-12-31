package com.example.esd_backend.service;

import com.example.esd_backend.dto.StationDto;
import com.example.esd_backend.dto.StationNameTypeDto;
import com.example.esd_backend.mapper.StationMapper;
import com.example.esd_backend.model.Station;
import com.example.esd_backend.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {
    private final StationRepository stationRepository;
    private final NotificationService notificationService;

    public StationService(StationRepository stationRepository, NotificationService notificationService) {
        this.stationRepository = stationRepository;
        this.notificationService = notificationService;
    }

    public void addStation(StationDto stationDto) {
        if (stationRepository.findByName(stationDto.getName()).isPresent()) {
            throw  new RuntimeException("Station with the same name exists");
        }
        Station station = StationMapper.toEntity(stationDto);
        Station savedStation = stationRepository.save(station);
        notificationService.notifyAddStation(savedStation);
    }

    public List<StationDto> getAllStations() {
        List<Station> stations = stationRepository.GetAll();
        return stations.stream()
                .map(StationMapper::toDto)
                .toList();

    }

}
