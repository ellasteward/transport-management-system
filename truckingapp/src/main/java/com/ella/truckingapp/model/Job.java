package com.ella.truckingapp.model;

import jakarta.persistence.*;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pickupLocation;
    private String deliveryLocation;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @ManyToOne
    private Driver driver;

    public Job() {}

    public Long getId() { return id; }

    public String getPickupLocation() { return pickupLocation; }

    public String getDeliveryLocation() { return deliveryLocation; }

    public JobStatus getStatus() { return status; }

    public Driver getDriver() { return driver; }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public void setDeliveryLocation(String deliveryLocation) {
        this.deliveryLocation = deliveryLocation;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }
}