package com.ella.truckingapp.controller;

import com.ella.truckingapp.model.*;
import com.ella.truckingapp.repository.*;
import com.ella.truckingapp.model.JobStatus;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

        // SET DEFAULT STATUS
        job.setStatus(JobStatus.PENDING);

        // LINK DRIVER
        if (job.getDriver() != null && job.getDriver().getId() != null) {

            Driver driver = driverRepository
                    .findById(job.getDriver().getId())
                    .orElse(null);

            job.setDriver(driver);
        }

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

    @PutMapping("/{jobId}/comment")
    public Job updateComment(@PathVariable Long jobId, @RequestBody Map<String, String> body) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        String newComment = body.get("comment");

        // Get existing comments
        String existingComments = job.getComments();

        if (existingComments == null || existingComments.isEmpty()) {
            job.setComments(newComment);
        } else {
            job.setComments(existingComments + " | " + newComment);
        }

        return jobRepository.save(job);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id, @RequestBody Job updatedJob) {

        Job job = jobRepository.findById(id).orElseThrow();

        job.setPickupLocation(updatedJob.getPickupLocation());
        job.setDeliveryLocation(updatedJob.getDeliveryLocation());
        job.setJobDate(updatedJob.getJobDate());
        job.setWeight(updatedJob.getWeight());
        job.setTruckType(updatedJob.getTruckType());
        job.setComments(updatedJob.getComments());

        return jobRepository.save(job);
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    @GetMapping("/driver/{driverId}")
    public List<Job> getJobsByDriver(@PathVariable Long driverId) {
        return jobRepository.findByDriverId(driverId);
    }
}