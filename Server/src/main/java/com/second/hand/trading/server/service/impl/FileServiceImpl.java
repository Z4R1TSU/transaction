package com.second.hand.trading.server.service.impl;

import com.second.hand.trading.server.service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        if (multipartFile.isEmpty()) {
            throw new IOException("Cannot upload an empty file.");
        }
        byte[] bytes = multipartFile.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
