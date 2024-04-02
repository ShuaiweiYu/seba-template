import React, {useState} from 'react'
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import "./LoginModal.css"

const LoginModal = () => {
    return (
        <form
            onSubmit={(event) => {
                alert("submitted");
            }}
        >
            <Stack spacing={1}>
                <Input placeholder="email" required/>
                <Input placeholder="password" required/>
                <Input placeholder="confirm password" required/>
                <Button type="submit">Submit</Button>
            </Stack>
        </form>
    //     todo:表单要做验证
    //     todo:样子改好看一点
    //     todo:加上忘记密码
    //     todo:加上注册
    //     todo:加上OAuth登录选项
    )
}


export default LoginModal;