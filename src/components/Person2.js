import React, {useState, useEffect } from 'react';
import { Card, Form,Button } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSave, faPlusSquare, faUndo, faList, faEdit} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import SuccessToast from './SuccessToast';


const initialState = {
    id:'', 
    firstName:'',
    lastName:'', 
    dob:'', 
    bio:'', 
    photoUrl:''
    
  };

  

export default function Person(props){

    const [show, setShow] = useState(false);    
    const personId = +props.match.params.id;

    const [{ id, firstName,lastName, dob, bio, photoUrl},setState] = useState(initialState);

      const clearState = () => {
        setState({ ...initialState });
      };
    
      const hanldeChange = e => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));
      };
    
    function handleSubmit()
    {
        let person = {
            id: id,
            firstName: firstName, 
            lastName: lastName, 
            dob: dob, 
            bio: bio, 
            photoUrl:photoUrl
        };
        axios.post("http://localhost:8080/api/v1/person",person)
        .then((response) => {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                clearTimeout(timer);
                clearState();
            }, 3000);
            document.getElementById("personFormId").reset();
            
            
        });
    }

    useEffect(() => {

       
        try {
            
            if(personId > 0)
            {
                axios.get("http://localhost:8080/api/v1/person/"+personId)
                .then((response) => {
                    if(response.data !=null){ 
                       
                    }  
                });   
            }
            
        } catch (error) {
            console.log(error);
        }
    });
 
        return(
            <div>
                {show ? 
                <div style={{"display": show ? "block" : "none"}}>
                    <SuccessToast show ={show} message={personId > 1 ? "Person Updated Successfully." : "Person Saved Successfully."} type={"success"}/>
                </div>:''
            }
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={id ? faEdit : faPlusSquare} /> {id ? "Update Person" : "Add New Person"}</Card.Header>
                    <Form id="personFormId" onSubmit={(e) =>{handleSubmit();e.preventDefault();}}>
                        <Card.Body>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={firstName}
                                    onChange={hanldeChange}
                                    name="firstName"
                                    placeholder="Enter First Name" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={lastName}
                                    onChange={hanldeChange}
                                    name="lastName"
                                    placeholder="Enter Last Name" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="dob">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dob}
                                    onChange={hanldeChange}
                                    name="dob"
                                    placeholder="Enter DOB" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="photoUrl">
                                <Form.Label>Photo Url</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={photoUrl}
                                    onChange={hanldeChange}
                                    name="photoUrl"
                                    placeholder="Enter Photo Url" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="bio">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control as="textarea"
                                    name="bio"
                                    value={bio}
                                    onChange={hanldeChange}
                                    rows="3" required autoComplete="off" />
                            </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave} /> {id ? "Update" : "Save"} 
                        </Button>{' '}
                        <Button size="sm" variant="info" type="reset" onClick={(e) =>{clearState();}}>
                                <FontAwesomeIcon icon={faUndo} /> Reset
                        </Button>{' '}
                        <Button onClick={()=>{props.history.push("/list")}} size="sm" variant="info" type="reset">
                                <FontAwesomeIcon icon={faList} /> Person List
                        </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div> 
        );
}
