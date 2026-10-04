package com.samay.jobtracker.repository;

import com.samay.jobtracker.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(String status);
    List<Job> findByPlatform(String platform);
    List<Job> findByCompanyNameContainingIgnoreCaseOrJobTitleContainingIgnoreCase(String companyName, String jobTitle);
}
