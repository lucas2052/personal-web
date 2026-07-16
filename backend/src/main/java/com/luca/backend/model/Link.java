package com.luca.backend.model;

import jakarta.persistence.*;

/**
 * An external hyperlink shown on the "Contact me" page
 * (e.g. GitHub, LinkedIn, Instagram, another site). Managed by the owner in admin.
 */
@Entity
@Table(name = "links")
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** display text, e.g. "GitHub" */
    private String label;

    /** where it points, e.g. "https://github.com/lucas2052" */
    private String url;

    /** lower numbers show first */
    private int sortOrder = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
