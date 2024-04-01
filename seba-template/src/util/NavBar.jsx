import {Link} from "react-router-dom";
import {useState} from "react";
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import {styled} from '@mui/joy/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import IconButton from '@mui/joy/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import "./NavBar.css"

import travel from "../Assets/travel.png";
import darkmode from "../Assets/night-mode.png";
import lightmode from "../Assets/day-mode.png";

import LoginModal from "./LoginModal";


const NavBar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        //     todo: 替换掉图标现在这个有点丑
        //     todo: 实现暗黑模式，把一些基础的css放在App.css里面，比如a的颜色装饰等等，这里只要字体大小
    };

    const BootstrapDialog = styled(Dialog)(({theme}) => ({
        '& .MuiDialogContent-root': {
            padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
        },
    }));

    return (
        <div className="container">
            <div>
                <img src={travel} className="logo" alt="icon"/>
            </div>

            <div className="title">
                <h1>Seba example page</h1>
            </div>

            <div className="nav">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/About">About</Link></li>
                        <li><Link to="/Product">Product</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="identity">
                <ButtonGroup variant="outlined" aria-label="Basic button group">
                    <Button onClick={handleClickOpen}>Sign up</Button>
                    <Button>Log in</Button>
                </ButtonGroup>

                <div>
                    <BootstrapDialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={open}
                    >
                        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                            Create an account
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            // sx={{
                            //     position: 'absolute',
                            //     right: 8,
                            //     top: 8,
                            //     color: (theme) => theme.palette.grey[500],
                            // }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent dividers>
                           <LoginModal/>
                        </DialogContent>
                    </BootstrapDialog>
                </div>
            </div>

            <div className="darkmode">
                <button onClick={toggleDarkMode}>
                    <img src={isDarkMode ? lightmode : darkmode} className="darkmode-icon" alt="dark mode"/>
                </button>
            </div>

        </div>
    )
}

export default NavBar;