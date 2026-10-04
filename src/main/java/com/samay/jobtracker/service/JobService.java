package com.samay.jobtracker.service;

import com.samay.jobtracker.model.Job;
import com.samay.jobtracker.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public Job createJob(Job job) {
        if (job.getStatus() == null || job.getStatus().isEmpty()) {
            job.setStatus("Applied");
        }
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job jobDetails) {
        return jobRepository.findById(id).map(job -> {
            if(jobDetails.getCompanyName() != null) job.setCompanyName(jobDetails.getCompanyName());
            if(jobDetails.getJobTitle() != null) job.setJobTitle(jobDetails.getJobTitle());
            if(jobDetails.getJobType() != null) job.setJobType(jobDetails.getJobType());
            if(jobDetails.getPlatform() != null) job.setPlatform(jobDetails.getPlatform());
            if(jobDetails.getStatus() != null) job.setStatus(jobDetails.getStatus());
            if(jobDetails.getAppliedDate() != null) job.setAppliedDate(jobDetails.getAppliedDate());
            if(jobDetails.getFollowUpDate() != null) job.setFollowUpDate(jobDetails.getFollowUpDate());
            if(jobDetails.getNotes() != null) job.setNotes(jobDetails.getNotes());
            if(jobDetails.getJobUrl() != null) job.setJobUrl(jobDetails.getJobUrl());
            return jobRepository.save(job);
        }).orElseThrow(() -> new RuntimeException("Job not found with id " + id));
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    public List<Job> getJobsByStatus(String status) {
        return jobRepository.findByStatus(status);
    }

    public List<Job> getJobsByPlatform(String platform) {
        return jobRepository.findByPlatform(platform);
    }

    public List<Job> searchJobs(String keyword) {
        return jobRepository.findByCompanyNameContainingIgnoreCaseOrJobTitleContainingIgnoreCase(keyword, keyword);
    }

    public Map<String, Object> getJobStats() {
        List<Job> allJobs = jobRepository.findAll();
        long total = allJobs.size();
        long applied = allJobs.stream().filter(j -> "Applied".equalsIgnoreCase(j.getStatus())).count();
        long interview = allJobs.stream().filter(j -> "Interview".equalsIgnoreCase(j.getStatus())).count();
        long assessment = allJobs.stream().filter(j -> "Assessment".equalsIgnoreCase(j.getStatus())).count();
        long offered = allJobs.stream().filter(j -> "Offered".equalsIgnoreCase(j.getStatus())).count();
        long rejected = allJobs.stream().filter(j -> "Rejected".equalsIgnoreCase(j.getStatus())).count();
        
        double successRate = total == 0 ? 0 : ((double) offered / total) * 100;

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("applied", applied);
        stats.put("interview", interview);
        stats.put("assessment", assessment);
        stats.put("offered", offered);
        stats.put("rejected", rejected);
        stats.put("successRate", String.format("%.2f", successRate));

        return stats;
    }
}
