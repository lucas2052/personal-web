package com.luca.backend.repo;

import com.luca.backend.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LinkRepository extends JpaRepository<Link, Long> {
    List<Link> findAllByOrderBySortOrderAsc();
}
