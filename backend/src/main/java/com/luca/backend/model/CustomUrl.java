package com.luca.backend.model;

import jakarta.persistence.Embeddable;

/**
 * A single custom link on the profile (e.g. "Personal site", "Portfolio").
 * Embedded inside {@link Profile} — independent of the standalone Link entity.
 */
@Embeddable
public class CustomUrl {

    private String label;
    private String url;

    public CustomUrl() {}

    public CustomUrl(String label, String url) {
        this.label = label;
        this.url = url;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
