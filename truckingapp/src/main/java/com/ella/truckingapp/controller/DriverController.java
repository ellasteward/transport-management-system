package com.ella.truckingapp.controller;

import com.ella.truckingapp.model.Driver;
import com.ella.truckingapp.model.Job;
import com.ella.truckingapp.model.User;
import com.ella.truckingapp.repository.DriverRepository;
import com.ella.truckingapp.repository.JobRepository;
import com.ella.truckingapp.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    private final DriverRepository driverRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    // ✅ ONE constructor only
    public DriverController(DriverRepository driverRepository,
                            JobRepository jobRepository,
                            UserRepository userRepository) {
        this.driverRepository = driverRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Driver> getDrivers() {
        return driverRepository.findAll();
    }

    @PostMapping
    public Driver createDriver(@RequestBody Driver driver) {

        // Save driver
        Driver savedDriver = driverRepository.save(driver);

        // Create login user
        User user = new User();
        user.setUsername(driver.getUsername());
        user.setPassword(driver.getPassword());
        user.setRole(driver.getRole());
        userRepository.save(user);

        return savedDriver;
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