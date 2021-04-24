import React, { Component } from 'react';
import './Camera.css'
class Camera extends Component {
    render() {
        return (
            <div className="Main-camera">
                <img className ="Camera-display" src="http://localhost:8000/rgb" />
                <img className ="Camera-display" src="http://localhost:8000/noir" />
            </div>
            
        );
    }
}

export default Camera;