import React, { Component } from 'react';
import './Camera.css'
import socketIOClient from 'socket.io-client'
import { Button, Container } from 'reactstrap';

class Camera extends Component {

    state ={
        socket : null,
        socketFarmName : "none",
        socketNo : "none",
        socketId : "none",
        socketLeafarea : "none"
    }

    componentDidMount(){
        const socket = socketIOClient('http://localhost:3001')
        socket.on("mqtt",message=>{
            console.log(message)
        })
        this.setState({socket:socket})
    }

    onCapture=()=>{
        let message = {
            key : "capture",
            message : "cap"
        }
        this.state.socket.emit('message',JSON.stringify(message))
    }

    render() {
        return (
            <div className="Main-camera">
                <Container className="Camera-Display">
                    <img className ="Camera-display" src="http://localhost:8000/rgb" />
                    <img className ="Camera-display" src="http://localhost:8000/noir" />
                </Container>
                <Container>
                    <h1>ชื่อฟาร์ม : {this.state.socketFarmName} </h1>
                    <h1>ต้นที่ : {this.state.socketNo} </h1>
                    <h1>ID : {this.state.socketId} </h1>
                    <h1>Leaf Area  : {this.state.socketFarmName} </h1>
                    <Button onClick={this.onCapture}>Capture</Button>
                </Container>                
            </div>
            
        );
    }
}

export default Camera;