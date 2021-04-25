import React, { Component } from 'react';
import './Main.css'
import Camera from './Camera'
import Farm from './Farm';
import Photo from './Photo';
import {Route} from 'react-router-dom'
import {
    NavLink,
    Button
} from 'reactstrap'



class Main extends Component {
    render() {
        return (
            <body className="Main-display" >
                <div className="Tabbar">
                    <Button href="/camera">camera</Button>
                    <Button href="/farm">farm</Button>
                    <Button href="/photo">photo</Button>
                </div>
                <Route path="/camera" component={Camera}/>
                <Route path="/farm" component={Farm}/>
                <Route path="/photo" component={Photo}/>
                {/* <Route/> */}
            </body>
        );
    }
}

export default Main;