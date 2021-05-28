import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText ,Badge, Container} from 'reactstrap';
import './Photo.css'
class Photo extends Component {
    state ={
        farm_current : "",
        list_farm : [] ,
        image_capture : {
            listRGB : [],
            listNOIR : []
        } 
    }

    componentDidMount(){
        this.onGetListFarmAPI()
    }
    onSelectDropDown=async (e)=>{
        await this.setState({farm_current : e.target.value})
        await this.onGetListImagrCaptureAPI()
    }
    onGetListImagrCaptureAPI = async () =>{
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({farmName : this.state.farm_current}),
            headers: { 'Content-Type': 'application/json' }

        };

        await fetch('http://localhost:3002/farm/listImageCapture',requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            this.setState({
                image_capture : {
                    listRGB : data['listRGB'],
                    listNOIR : data['listNOIR']
                }
            })            
        });
    }
    onGetListFarmAPI = async () =>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        await fetch('http://localhost:3002/farm/listfarm',requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            if(data['list'].length == 0){

            }else{
                this.setState({
                    list_farm : data['list']
                })
            }
            
        });
    }
    



    render() {
        var farm_list_dropdowm = []
        for (let item of this.state.list_farm){
            farm_list_dropdowm.push(<option>{item}</option>)
        }
        var list_RGB = []
        var list_NOIR = []
        for (let item of this.state.image_capture.listRGB){
            var urRGB = "http://localhost:3002/imageRGB/"+this.state.farm_current+"/"+item
            list_RGB.push(<img src={urRGB} className="image-Size"/>)  
        }
        for (let item of this.state.image_capture.listNOIR){
            var urNOIR = "http://localhost:3002/imageNOIR/"+this.state.farm_current+"/"+item
            list_NOIR.push(<img src={urNOIR} className="image-Size"/>)  
        }
        // image_capture : {
        //     listRGB : [],
        //     listNOIR : []
        // } 

        return (
            <div className="Main-photo">
                <Container>
                    <FormGroup className="Farm-Select">
                        <h1 className="head">เรียกดูข้อมูลการถ่ายภาพ</h1>
                        <Label for="exampleSelect">เลือกฟาร์ม</Label>
                        <Input type="select" onChange={this.onSelectDropDown} value={this.state.farm_current}>
                        {farm_list_dropdowm}
                        </Input>
                    </FormGroup>
                </Container>
                <Container className="Photo-muti">
                    <Container className="Photo-single">
                        {list_RGB}
                    </Container>
                    <Container className="Photo-single">
                        {list_NOIR}
                    </Container>
                </Container>
            </div>
        );
    }
}

export default Photo;