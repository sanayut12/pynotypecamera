import React, { Component } from 'react';
import './Main.css'
import Camera from './Camera'
class Main extends Component {
    render() {
        return (
            <body className="Main-display">
                <div className="Tabbar">
                    dsd
                </div>
                <Camera />
                <button className="Button-capture">click</button>

            </body>
        );
    }
}

export default Main;