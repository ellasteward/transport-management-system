package com.ella.truckingapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Pickup location required")
    private String pickupLocation;

    @NotBlank(message = "Delivery location required")
    private String deliveryLocation;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @NotBlank(message = "Job date required")
    private String jobDate;

    @NotBlank(message = "Truck type required")
    private String truckType;

    @NotNull(message = "Weight required")
    private Double weight;

    private String comments;

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

    public String getJobDate() { return jobDate; }
    public void setJobDate(String jobDate) { this.jobDate = jobDate; }

    public String getTruckType() { return truckType; }
    public void setTruckType(String truckType) { this.truckType = truckType; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}