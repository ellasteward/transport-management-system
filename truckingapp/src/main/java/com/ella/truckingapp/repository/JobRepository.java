package com.ella.truckingapp.repository;

import com.ella.truckingapp.model.Job;
import com.ella.truckingapp.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByDriverId(Long driverId);

}