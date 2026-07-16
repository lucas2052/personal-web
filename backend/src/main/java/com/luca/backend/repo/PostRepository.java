package com.luca.backend.repo;

import com.luca.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);
    List<Post> findByTypeAndStatusOrderByCreatedAtDesc(String type, String status);
    List<Post> findByTypeOrderByCreatedAtDesc(String type);
}
