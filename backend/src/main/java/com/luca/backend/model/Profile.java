package com.luca.backend.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * The owner's personal info shown on the "Contact me" page.
 * There is only ever one row (the owner). Editable in admin, public to read.
 */
@Entity
@Table(name = "profile")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    /** a short intro / bio */
    @Column(columnDefinition = "text")
    private String bio;

    private String email;

    private String location;

    private String avatarUrl;

    /** Owner-defined links (personal site, portfolio, …). Stored in a side table. */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "profile_urls", joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "position")
    private List<CustomUrl> urls = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public List<CustomUrl> getUrls() { return urls; }
    public void setUrls(List<CustomUrl> urls) { this.urls = urls; }
}
