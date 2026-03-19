package com.ella.truckingapp.controller;

import com.ella.truckingapp.model.*;
import com.ella.truckingapp.repository.*;
import com.ella.truckingapp.model.JobStatus;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final DriverRepository driverRepository;

    public JobController(JobRepository jobRepository, DriverRepository driverRepository) {
        this.jobRepository = jobRepository;
        this.driverRepository = driverRepository;
    }

    @GetMapping
    public List<Job> getJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        job.setStatus(JobStatus.PENDING);
        return jobRepository.save(job);
    }

    @PutMapping("/{jobId}/assign/{driverId}")
    public Job assignDriver(@PathVariable Long jobId, @PathVariable Long driverId) {

        Job job = jobRepository.findById(jobId).orElseThrow();
        Driver driver = driverRepository.findById(driverId).orElseThrow();

        job.setDriver(driver);

        return jobRepository.save(job);
    }

    @PutMapping("/{jobId}/status")
    public Job updateStatus(@PathVariable Long jobId, @RequestParam JobStatus status) {

        Job job = jobRepository.findById(jobId).orElseThrow();

        job.setStatus(status);

        return jobRepository.save(job);
    }

}