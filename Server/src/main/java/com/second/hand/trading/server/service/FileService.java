package com.second.hand.trading.server.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    /**
     * 上传文件并转换为Base64字符串
     * @param multipartFile
     * @return Base64 encoded string of the file
     * @throws IOException
     */
    String uploadFile(MultipartFile multipartFile) throws IOException;
}
