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

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public void addStation(StationDto stationDto) {
        if (stationRepository.findByName(stationDto.getName()).isPresent()) {
            throw  new RuntimeException("Station with the same name exists");
        }
        Station station = StationMapper.toEntity(stationDto);
        stationRepository.InsertStation(station);
    }

    public List<StationNameTypeDto> getAllStations() {
        List<Station> stations = stationRepository.GetAll();
        return stations.stream()
                .map(s -> new StationNameTypeDto(s.getName(), s.getType()))
                .toList();

    }

}
