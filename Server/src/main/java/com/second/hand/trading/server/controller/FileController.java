package com.second.hand.trading.server.controller;

import com.second.hand.trading.server.enums.ErrorMsg;
import com.second.hand.trading.server.service.FileService;
import com.second.hand.trading.server.vo.ResultVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/file/upload-base64") // Changed endpoint for clarity
    public ResultVo uploadFileAsBase64(@RequestParam("file") MultipartFile multipartFile) {
        try {
            String base64Image = fileService.uploadFile(multipartFile);
            if (base64Image != null && !base64Image.isEmpty()) {
                return ResultVo.success(base64Image);
            } else {
                return ResultVo.fail(ErrorMsg.FILE_UPLOAD_ERROR);
            }
        } catch (IOException e) {
            System.err.println("Error uploading file: " + e.getMessage());
            return ResultVo.fail(ErrorMsg.SYSTEM_ERROR);
        }
    }
}
