package com.luca.backend.repo;

import com.luca.backend.model.ImageItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<ImageItem, Long> {
    List<ImageItem> findAllByOrderByCreatedAtDesc();
}
