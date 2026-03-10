package com.ella.truckingapp.model;

import jakarta.persistence.*;

@Entity
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String licenseNumber;

    public Driver() {}

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getPhone() { return phone; }

    public String getLicenseNumber() { return licenseNumber; }

    public void setName(String name) { this.name = name; }

    public void setPhone(String phone) { this.phone = phone; }

    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
}
