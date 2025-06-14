package com.xzl.transaction;

import com.xzl.transaction.Entities.CommonUser;
import com.xzl.transaction.Entities.DTO.ResultMessage;
import com.xzl.transaction.Entities.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static com.xzl.transaction.Enum.ResultCode.ERROR_NO_DATA;

@SpringBootTest
class XzlApplicationTests {
    @Test
    void contextLoads() {
    }

    @Test
    public void test1(){
        User user = new User("1", "xzl", "xzl3122004669", "30642254@qq.com", "0","-1");
        CommonUser commonUser = new CommonUser("1", "徐哲磊", "17815630260", "男", "北京", "123");
        List<Object> list=new ArrayList<>();
        list.add(user);
        list.add(commonUser);
        ResultMessage message=new ResultMessage(ERROR_NO_DATA,user,commonUser);
        System.out.println(message.toString());
    }
//    @Test
//    public void test2(){
//        Map<String,Object> map=new HashMap<>();
//        map.put("user",new User());
//        map.put("commonUser",new CommonUser());
//        List<Object> conversion = GsonUtil.Conversion(map, new String[]{"user", "commonUser"}, new Class[]{User.class, CommonUser.class});
//        for (Object o :conversion) {
//            System.out.println(o);
//        }
//    }

    @Test
    public void test2(){
        String goodsUUID="ce79d103-f2ce-4b8d-9478-edc7eab399be";
        String shopUUID="f653b418-8970-47df-9462-e43d1dfb1a78";
//        String url1 = PictureUtil.getUrl(shopUUID, goodsUUID, null);
//        System.out.println(url1);
    }

    @Test
    public void test3(){
        Integer a=50;
        Integer b=60;
        Double c= Double.valueOf(a*100/b);
        System.out.println(c);
    }
}
