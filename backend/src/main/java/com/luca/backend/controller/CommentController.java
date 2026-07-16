package com.luca.backend.controller;

import com.luca.backend.model.Comment;
import com.luca.backend.repo.CommentRepository;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentRepository comments;

    public CommentController(CommentRepository comments) {
        this.comments = comments;
    }

    @GetMapping
    public List<Comment> list(@PathVariable Long postId) {
        return comments.findByPostIdOrderByCreatedAtAsc(postId);
    }

    /** Public: anyone can leave a comment (留言). */
    @PostMapping
    public Comment create(@PathVariable Long postId, @RequestBody Comment comment) {
        comment.setId(null);
        comment.setPostId(postId);
        comment.setCreatedAt(Instant.now());
        return comments.save(comment);
    }
}
