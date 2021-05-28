import React, { Component } from 'react';
import './Main.css'
import Camera from './Camera'
import Farm from './Farm';
import Photo from './Photo';
import {Route} from 'react-router-dom'
import logo1 from './logo2.png'
import {
    NavLink,
    Button
} from 'reactstrap'



class Main extends Component {
    render() {
        return (
            <body className="Main-display" href="/camera">
                
                <Route path="/camera" component={Camera}/>
                <Route path="/farm" component={Farm}/>
                <Route path="/photo" component={Photo}/>
                {/* <Route/> */}
                <div className="Tabbar">
                    <img src={logo1} className="logo1"/>
                    <Button className="Button-capture" href="/camera">camera</Button>
                    <Button className="Button-capture" href="/farm">farm</Button>
                    <Button className="Button-capture" href="/photo">photo</Button>
                </div>
            </body>
        );
    }
}

export default Main;