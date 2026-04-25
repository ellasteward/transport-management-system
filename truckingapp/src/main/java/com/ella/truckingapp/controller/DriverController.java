package com.ella.truckingapp.controller;

import com.ella.truckingapp.model.Driver;
import com.ella.truckingapp.model.Job;
import com.ella.truckingapp.repository.DriverRepository;
import com.ella.truckingapp.repository.JobRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    private final DriverRepository driverRepository;
    private final JobRepository jobRepository;

    public DriverController(DriverRepository driverRepository, JobRepository jobRepository) {
        this.driverRepository = driverRepository;
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Driver> getDrivers() {
        return driverRepository.findAll();
    }

    @PostMapping
    public Driver createDriver(@RequestBody Driver driver) {
        return driverRepository.save(driver);
    }

    @PutMapping("/{id}")
    public Driver updateDriver(@PathVariable Long id, @RequestBody Driver updatedDriver) {

        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setName(updatedDriver.getName());
        driver.setPhone(updatedDriver.getPhone());
        driver.setLicenseNumber(updatedDriver.getLicenseNumber());

        return driverRepository.save(driver);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {

        boolean hasJobs = jobRepository.findAll().stream()
                .anyMatch(j -> j.getDriver() != null && j.getDriver().getId().equals(id));

        if (hasJobs) {
            return ResponseEntity
                    .badRequest()
                    .body("Driver has assigned jobs");
        }

        driverRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}