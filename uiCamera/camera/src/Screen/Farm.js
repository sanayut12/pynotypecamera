import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
// import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText ,Badge} from 'reactstrap';
import './Farm.css'

class Farm extends Component {
    state = {
        farmNAmeInput :"",
        list_farm : [] ,
        farm_current : "",
        amount : 0,
        QrImage : []

    }

    async componentDidMount(){
        this.onGetListFarmAPI()
    }

    onFarmname = (e)=> {
        this.setState({farmNAmeInput : e.target.value})
        console.log(e.target.value)
    }
    onAddTreeAPI =async () =>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                farmName : this.state.farm_current,
                amount : this.state.amount
            })
        };

        await fetch('http://localhost:3002/farm/addTree',requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            this.setState({QrImage : data['list']})
        });
    }
    onGetListQRAPI =async (name) =>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({farmName : name})
        };

        await fetch('http://localhost:3002/farm/listQrcode',requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            this.setState({QrImage : data['list']})
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
                    list_farm : data['list'],
                    farm_current : data['list'][1]
                })
            }
            
        });
    }
    onCreateFarmAPI=async ()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({farmName : this.state.farmNAmeInput})
        };

        await fetch('http://localhost:3002/farm/createfarm',requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            this.setState({list_farm : data['list']})
            this.setState({farmNAmeInput : ""})
        });

    }


    onSelectDropDown=(e)=>{
        this.setState({farm_current : e.target.value})
        this.onGetListQRAPI(e.target.value)
    }

    
    onAddAmount=()=>{
        var value = this.state.amount
        // console.log(value)

        this.setState({amount : value +1})

        
    }
    onSubAmount=()=>{
        var value = this.state.amount
        if (value > 0){
            this.setState({amount : value -1})
        }
    }

    render() {
        var farm_list_dropdowm = []
        for (let item of this.state.list_farm){
            farm_list_dropdowm.push(<option>{item}</option>)
        }
        
        var Imagelist = []
        for (let i =1;i <= this.state.QrImage.length;i++){
            var urlQr = "http://localhost:3002/Qrcode/"+this.state.farm_current+"/"+i+".jpg"
            let name = i
            Imagelist.push(
                
                <div className="Card_QR">
                    {name}
                    <img src={urlQr} className="ImageQrcode"/>
                </div>
            )
        }

        return (
            <div className="Main-farm">
                <Container className="Create_farm_bar">
                    
                    <Form className="Create_Farm"> 
                        <h2 className="head">เพิ่ม/แก้ ข้อมูลฟาร์ม</h2>
                        <FormGroup>
                            <Label >สร้างฟาร์ม : </Label>
                            <Input value={this.state.farmNAmeInput} onChange={this.onFarmname}  placeholder="enter farm name"/>
                            <Button onClick={this.onCreateFarmAPI}>สร้าง</Button>
                        </FormGroup>                    
                    </Form>
                </Container>
                <Container className="Screen_Tree_manage"> 
                    <div className="Screen_Tree_manageLeft">
                        <Form className="Farm-mange">
                            <FormGroup>
                                <Label for="exampleSelect">เลือกฟาร์ม</Label>
                                <Input type="select" onChange={this.onSelectDropDown} value={this.state.farm_current}>
                                {farm_list_dropdowm}
                                </Input>
                            </FormGroup>
                            <FormGroup className="Add_tree">
                                <Button className="Button_add_tree" onClick={this.onSubAmount}>
                                    <h1 className="postion_self">-</h1>
                                </Button>
                                <h1><Badge>{this.state.amount}</Badge></h1>
                                <Button className="Button_add_tree" onClick={this.onAddAmount}>
                                    <h1 className="postion_self">+</h1>
                                </Button>
                            </FormGroup>
                            <FormGroup>
                                <Button className="buttonAddtree" onClick={this.onAddTreeAPI}>
                                    <h2>เพิ่มต้นไม้</h2>
                                </Button>

                                <h4>มีต้นไม้ในฟาร์ม {Imagelist.length} ต้น</h4>
                            </FormGroup>
                        </Form>
                    </div>
                    <div className="Screen_Tree_manageRight">
                        {Imagelist}
                    </div>
                   
                </Container>
                
            </div>
        );
    }
}

export default Farm;