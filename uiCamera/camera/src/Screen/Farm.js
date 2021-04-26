import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './Farm.css'

class Farm extends Component {
    state = {
        farmNAmeInput :"",

    }
    render() {
        return (
            <div className="Main-farm">
                <Form>
                    <FormGroup>
                        <Label >Email</Label>
                        <Input onChange=""/>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default Farm;