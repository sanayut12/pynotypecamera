import React, { Component } from 'react';
import './Camera.css'
import socketIOClient from 'socket.io-client'

class Camera extends Component {

    state ={
        socket : null
    }

    componentDidMount(){
        const socket = socketIOClient('http://localhost:3001')
        socket.on("mqtt",message=>{
            // console.log('hello1212312121')
            console.log(message)
        })
        this.setState({socket:socket})
    }

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