package com.second.hand.trading.server.enums;


/**
 * 错误信息枚举类
 */
public enum ErrorMsg {

    ACCOUNT_EXIT("用户已存在"),
    ACCOUNT_Ban("账号已被封禁"),
    ACCOUNT_NOT_EXIT("用户不存在"),
    PASSWORD_IS_NOT_SAME("密码不一致"),
    PASSWORD_RESET_ERROR("修改密码失败"),
    EMAIL_SEND_ERROR("邮件发送失败 请重试"),
    PARAM_ERROR("参数错误"),
    SYSTEM_ERROR("系统错误"),
    REGISTER_ERROR("注册失败"),
    FILE_TYPE_ERROR("文件类型错误 请选择.jpg或.png"),
    FILE_UPLOAD_ERROR("文件上传失败"),
    FILE_NOT_EXIT("文件不存在"),
    FILE_DOWNLOAD_ERROR("文件下载异常"),
    FILE_SIZE_ERROR("文件过大"),
    OPERAT_FREQUENCY("操作频繁 稍后重试"),
    MISSING_PARAMETER("缺少参数"),
    COOKIE_ERROR("请重新登录"),
    EMAIL_LOGIN_ERROR("登录失败 账号或密码错误"),
    JSON_READ_ERROR("json参数解析错误"),
    FORM_NUMBER_ERROR("表单id错误"),
    REPEAT_COMMIT_ERROR("请勿重复提交"),
    COMMIT_FAIL_ERROR("提交失败"),
    FAVORITE_EXIT("收藏已存在"),

    SECKILL_NOT_START("秒杀未开始"),
    SECKILL_ENDED("秒杀已结束"),
    SECKILL_NOT_EXIST("秒杀活动不存在"),
    SECKILL_SOLD_OUT("秒杀库存不足"),
    SECKILL_REPEAT_BUY("请勿重复下单"),
    SECKILL_RATE_LIMIT("请求过于频繁 稍后重试"),
    SECKILL_ORDER_NOT_EXIST("秒杀订单不存在"),
    SECKILL_ORDER_STATUS_ERROR("秒杀订单状态异常");

    private String msg;

    ErrorMsg(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
