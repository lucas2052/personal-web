package com.luca.backend.controller;

import com.luca.backend.model.Link;
import com.luca.backend.repo.LinkRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/links")
public class LinkController {

    private final LinkRepository links;

    public LinkController(LinkRepository links) {
        this.links = links;
    }

    /** Public: list of external links, in display order. */
    @GetMapping
    public List<Link> list() {
        return links.findAllByOrderBySortOrderAsc();
    }

    /** Owner only: add a link. */
    @PostMapping
    public Link create(@RequestBody Link link) {
        link.setId(null);
        return links.save(link);
    }

    /** Owner only: edit a link. */
    @PutMapping("/{id}")
    public ResponseEntity<Link> update(@PathVariable Long id, @RequestBody Link incoming) {
        return links.findById(id).map(existing -> {
            existing.setLabel(incoming.getLabel());
            existing.setUrl(incoming.getUrl());
            existing.setSortOrder(incoming.getSortOrder());
            return ResponseEntity.ok(links.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Owner only: delete a link. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!links.existsById(id))
            return ResponseEntity.notFound().build();
        links.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
