import logo from "../logo.svg";
import Button from '@mui/material/Button';

const Home = () => {
    return (
        <div>
            <Button variant="contained">Hello world</Button>

            <img src={logo} className="App-logo" alt="logo"/>
        </div>
    )
}

export default Home;