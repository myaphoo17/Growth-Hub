package com.E_Learnig.System.DAO.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;
    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }
    public Map<String, Object> uploadFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Empty file");
        }

        String resourceType = getResourceType(file.getContentType());
        String originalFilename = file.getOriginalFilename();
        String publicId = "samples/" + getOriginalFilenameWithExtension(originalFilename); // Set the folder and file name

        Map<String, Object> options = ObjectUtils.asMap(
                "resource_type", resourceType,
                "public_id", publicId,
                "use_filename", true,
                "unique_filename", true
        );

        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        return uploadResult;
    }

    private String getResourceType(String contentType) {
        if (contentType == null) {
            return "auto";
        }
        if (contentType.startsWith("image/")) {
            return "image";
        } else if (contentType.startsWith("video/")) {
            return "video";
        } else if (contentType.equals("application/pdf") ||
                contentType.equals("application/vnd.ms-excel") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
                contentType.equals("application/vnd.ms-powerpoint") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.presentationml.presentation") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            return "raw";
        } else {
            return "auto";
        }
    }

    private String getOriginalFilenameWithExtension(String filename) {
        if (filename == null) {
            return null;
        }
        int lastSlashIndex = filename.lastIndexOf('/');
        if (lastSlashIndex != -1) {
            filename = filename.substring(lastSlashIndex + 1);
        }
        return filename;
    }
}
