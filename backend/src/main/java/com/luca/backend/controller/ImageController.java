package com.luca.backend.controller;

import com.luca.backend.model.ImageItem;
import com.luca.backend.repo.ImageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageRepository images;

    public ImageController(ImageRepository images) {
        this.images = images;
    }

    @GetMapping
    public List<ImageItem> list() {
        return images.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ImageItem create(@RequestBody ImageItem item) {
        item.setId(null);
        item.setCreatedAt(Instant.now());
        return images.save(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!images.existsById(id)) return ResponseEntity.notFound().build();
        images.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
