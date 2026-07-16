package com.luca.backend.controller;

import com.luca.backend.model.Post;
import com.luca.backend.repo.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository posts;

    public PostController(PostRepository posts) {
        this.posts = posts;
    }

    /** Public listing. type = BLOG or PORTFOLIO. Only published unless includeDrafts=true (admin). */
    @GetMapping
    public List<Post> list(@RequestParam(defaultValue = "BLOG") String type,
                           @RequestParam(defaultValue = "false") boolean includeDrafts,
                           Authentication auth) {
        // NOTE: unauthenticated requests still get an anonymous token whose
        // isAuthenticated() is true, so we must explicitly exclude anonymous.
        boolean isOwner = auth != null
                && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken);

        // Only a logged-in owner may see drafts; everyone else gets published only.
        if (includeDrafts && isOwner) {
            return posts.findByTypeOrderByCreatedAtDesc(type);
        }
        return posts.findByTypeAndStatusOrderByCreatedAtDesc(type, "PUBLISHED");
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Post> getBySlug(@PathVariable String slug) {
        return posts.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Post create(@RequestBody Post post) {
        post.setId(null);
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());
        return posts.save(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody Post incoming) {
        return posts.findById(id).map(existing -> {
            existing.setTitle(incoming.getTitle());
            existing.setSlug(incoming.getSlug());
            existing.setContent(incoming.getContent());
            existing.setCoverImage(incoming.getCoverImage());
            existing.setType(incoming.getType());
            existing.setStatus(incoming.getStatus());
            existing.setUpdatedAt(Instant.now());
            return ResponseEntity.ok(posts.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!posts.existsById(id)) return ResponseEntity.notFound().build();
        posts.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
