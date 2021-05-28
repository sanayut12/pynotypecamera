import React, { Component } from 'react';
import './Camera.css'
import socketIOClient from 'socket.io-client'
import { Button, Container } from 'reactstrap';

class Camera extends Component {

    state ={
        socket : null,
        socketFarmName : "none",
        socketNo : "none",
        socketLeafarea : "none",
        socketNDVI : "none",
        socketOncapture : "none"
    }

    componentDidMount(){
        const socket = socketIOClient('http://localhost:3001')
        socket.on("mqtt",message=>{
            console.log(message)
            
        })
        socket.on("farmName",message=>{
            console.log(message)
            this.setState({
                socketFarmName : message
            })
        })
        socket.on("number",message=>{
            console.log(message)
            this.setState({
                socketNo : message
            })
        })
        socket.on("oncapture",message=>{
            console.log(message)
            this.setState({
                socketOncapture : message
            })
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
                <Container className="Detail">
                    <h1>การถ่ายรูป</h1>
                    <h2>ชื่อฟาร์ม : {this.state.socketFarmName} </h2>
                    <h2>ต้นที่ : {this.state.socketNo} </h2>
                    <h2>Leaf Area  : {this.state.socketLeafarea} </h2>
                    <h2>NDVI  : "none" </h2>
                    <Button className="ButtonCapture" onClick={this.onCapture}>Capture</Button>
                    <h1>{this.state.socketOncapture}</h1>
                </Container>                
            </div>
            
        );
    }
}

export default Camera;
