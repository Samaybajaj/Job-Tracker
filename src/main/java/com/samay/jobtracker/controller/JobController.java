package com.samay.jobtracker.controller;

import com.samay.jobtracker.model.Job;
import com.samay.jobtracker.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return new ResponseEntity<>(jobService.getAllJobs(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobService.getJobById(id);
        return job.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        try {
            Job createdJob = jobService.createJob(job);
            return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        try {
            Job updatedJob = jobService.updateJob(id, jobDetails);
            return new ResponseEntity<>(updatedJob, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteJob(@PathVariable Long id) {
        try {
            jobService.deleteJob(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Job>> getJobsByStatus(@PathVariable String status) {
        return new ResponseEntity<>(jobService.getJobsByStatus(status), HttpStatus.OK);
    }

    @GetMapping("/platform/{platform}")
    public ResponseEntity<List<Job>> getJobsByPlatform(@PathVariable String platform) {
        return new ResponseEntity<>(jobService.getJobsByPlatform(platform), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(@RequestParam("q") String keyword) {
        return new ResponseEntity<>(jobService.searchJobs(keyword), HttpStatus.OK);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getJobStats() {
        return new ResponseEntity<>(jobService.getJobStats(), HttpStatus.OK);
    }
}
