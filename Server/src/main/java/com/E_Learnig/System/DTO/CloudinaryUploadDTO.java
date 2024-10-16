package com.E_Learnig.System.DTO;

import lombok.Getter;
import lombok.Setter;


import java.util.Collection;
import java.util.List;

import java.util.Map;
import java.util.Set;

@Getter
@Setter
public class CloudinaryUploadDTO implements Map {

    private String url;
    private String publicId;
    private String resourceType;

    @Override
    public int size() {
        return 0;
    }

    @Override
    public boolean isEmpty() {
        return false;
    }

    @Override
    public boolean containsKey(Object key) {
        return false;
    }

    @Override
    public boolean containsValue(Object value) {
        return false;
    }

    @Override
    public Object get(Object key) {
        return null;
    }

    @Override
    public Object put(Object key, Object value) {
        return null;
    }

    @Override
    public Object remove(Object key) {
        return null;
    }

    @Override
    public void putAll(Map m) {

    }

    @Override
    public void clear() {

    }

    @Override
    public Set keySet() {
        return Set.of();
    }

    @Override
    public Collection values() {
        return List.of();
    }

    @Override
    public Set<Entry> entrySet() {
        return Set.of();
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }
}
