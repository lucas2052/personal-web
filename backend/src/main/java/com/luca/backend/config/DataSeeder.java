package com.luca.backend.config;

import com.luca.backend.model.ImageItem;
import com.luca.backend.model.Link;
import com.luca.backend.model.Post;
import com.luca.backend.model.Profile;
import com.luca.backend.repo.ImageRepository;
import com.luca.backend.repo.LinkRepository;
import com.luca.backend.repo.PostRepository;
import com.luca.backend.repo.ProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Seeds a little sample content on startup so the site isn't empty in dev. */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(PostRepository posts, ImageRepository images,
                           ProfileRepository profiles, LinkRepository links) {
        return args -> {
            if (posts.count() == 0) {
                Post blog = new Post();
                blog.setTitle("Hello, world");
                blog.setSlug("hello-world");
                blog.setType("BLOG");
                blog.setStatus("PUBLISHED");
                blog.setContent("<p>This is my first post. Welcome to my site — built with "
                        + "React, three.js and a Spring Boot backend.</p>");
                posts.save(blog);

                Post work = new Post();
                work.setTitle("Music Match");
                work.setSlug("music-match");
                work.setType("PORTFOLIO");
                work.setStatus("PUBLISHED");
                work.setContent("<p>A full-stack music taste-matching app: acoustic data modelling "
                        + "in Node.js, matching by Euclidean distance, deployed on AWS.</p>");
                posts.save(work);
            }

            if (images.count() == 0) {
                ImageItem img = new ImageItem();
                img.setTitle("Wellington coast");
                img.setUrl("https://picsum.photos/seed/wellington/900/600");
                img.setCaption("A test shot from the gallery.");
                images.save(img);
            }

            if (profiles.count() == 0) {
                Profile profile = new Profile();
                profile.setName("Luca Li");
                profile.setBio("Product & content, now building things. Based in Wellington, NZ.");
                profile.setEmail("llj13yffs@gmail.com");
                profile.setLocation("Wellington, New Zealand");
                profiles.save(profile);
            }

            if (links.count() == 0) {
                Link github = new Link();
                github.setLabel("GitHub");
                github.setUrl("https://github.com/lucas2052");
                github.setSortOrder(1);
                links.save(github);

                Link linkedin = new Link();
                linkedin.setLabel("LinkedIn");
                linkedin.setUrl("https://linkedin.com/in/luca-li2052/");
                linkedin.setSortOrder(2);
                links.save(linkedin);
            }
        };
    }
}
