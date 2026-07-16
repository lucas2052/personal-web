package com.luca.backend.controller;

import com.luca.backend.model.Profile;
import com.luca.backend.repo.ProfileRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileRepository profiles;

    public ProfileController(ProfileRepository profiles) {
        this.profiles = profiles;
    }

    /** Public: the single owner profile. Returns an empty profile if none set yet. */
    @GetMapping
    public Profile get() {
        return profiles.findAll().stream().findFirst().orElseGet(Profile::new);
    }

    /** Owner only: create-or-update the single profile (upsert). */
    @PutMapping
    public Profile update(@RequestBody Profile incoming) {
        Profile profile = profiles.findAll().stream().findFirst().orElseGet(Profile::new);
        profile.setName(incoming.getName());
        profile.setBio(incoming.getBio());
        profile.setEmail(incoming.getEmail());
        profile.setLocation(incoming.getLocation());
        profile.setAvatarUrl(incoming.getAvatarUrl());
        // Replace the custom-URL list in place (clear + re-add) so JPA cleans up
        // removed rows in the profile_urls side table.
        profile.getUrls().clear();
        if (incoming.getUrls() != null) {
            profile.getUrls().addAll(incoming.getUrls());
        }
        return profiles.save(profile);
    }
}
