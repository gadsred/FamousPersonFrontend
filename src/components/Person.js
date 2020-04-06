import React, {Component} from 'react';
import { Card, Table, Form,Button } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSave, faPlusSquare, faUndo, faList, faEdit} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import SuccessToast from './SuccessToast';

export default class Person extends Component{
    constructor(props){
        super(props);
        this.state=this.initialState;
        this.state.show = false;
        this.personChange = this.personChange.bind(this);
        this.submitPerson = this.submitPerson.bind(this);
    }

    initialState={
        id:'', firstName:'', lastName:'', dob:'', bio:'', photoUrl:''
    };

    componentDidMount(){
        const personId = +this.props.match.params.id;
        if(personId){
            this.findPersonById(personId);    
        }
       

    }

    findPersonById = (personId) => {
        axios.get("http://localhost:8080/api/v1/person/"+personId)
                .then(response => {
                    if(response.data !=null){
                        this.setState({
                            id: response.data.id,
                            firstName: response.data.firstName,
                            lastName: response.data.lastName,
                            dob: response.data.dob,
                            photoUrl: response.data.photoUrl,
                            bio: response.data.bio
                        });
                    }
                }).catch((error) => {
                    console.error("Error - "+error);
                });
    };

    submitPerson = event =>{
        event.preventDefault();
        let method = this.state.id ? "put" : "post";
        const person = {
            id:this.state.id,
            firstName:this.state.firstName, 
            lastName:this.state.lastName, 
            dob:this.state.dob, 
            bio:this.state.bio, 
            photoUrl:this.state.photoUrl
        };

        axios.post("http://localhost:8080/api/v1/person", person)
            .then(response => {
                console.log(response.data)
                if(response.data != null)
                {
                    this.setState({"show":true,"method":method});
                    setTimeout(() => this.setState({"show":false}),3000);
                }
                else{
                    this.setState({"show":false});
                }
            });this.setState(this.initialState);
    };

    resetPerson = () =>{
        this.setState(()=>this.initialState);
    };

    personChange = event =>{
        this.setState({
            [event.target.name]:event.target.value
        });
    };

    personList = () =>{
        return this.props.history.push("/list");
    };

    render(){
        const {firstName, lastName, dob, bio, photoUrl} = this.state;
        
        return(
            <div>
                <div style={{"display":this.state.show ? "block" : "none"}}>
                    <SuccessToast show ={this.state.show} message={this.state.method ==="put" ? "Person Updated Successfully." : "Person Saved Successfully."} type={"success"}/>
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare} /> {this.state.id ? "Update Person" : "Add New Person"}</Card.Header>
                    <Form onSubmit={this.submitPerson} onReset={this.resetPerson} id="personFormId">
                        <Card.Body>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={firstName}
                                    onChange={this.personChange}
                                    name="firstName"
                                    placeholder="Enter First Name" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={lastName}
                                    onChange={this.personChange}
                                    name="lastName"
                                    placeholder="Enter Last Name" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="dob">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dob}
                                    onChange={this.personChange}
                                    name="dob"
                                    placeholder="Enter DOB" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="photoUrl">
                                <Form.Label>Photo Url</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={photoUrl}
                                    onChange={this.personChange}
                                    name="photoUrl"
                                    placeholder="Enter Photo Url" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="bio">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control as="textarea"
                                    name="bio"
                                    value={bio}
                                    onChange={this.personChange}
                                    rows="3" required autoComplete="off" />
                            </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave} /> {this.state.id ? "Update" : "Save"} 
                        </Button>{' '}
                        <Button size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faUndo} /> Reset
                        </Button>{' '}
                        <Button size="sm" variant="info" type="reset" onClick={this.personList.bind()}>
                                <FontAwesomeIcon icon={faList} /> Person List
                        </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div> 
        );
    };
}
