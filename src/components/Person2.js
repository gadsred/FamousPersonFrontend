import React, {useState, useEffect } from 'react';
import { Card, Form,Button } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSave, faPlusSquare, faUndo, faList, faEdit} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import SuccessToast from './SuccessToast';

export default function Person(props){

    const [show, setShow] = useState('');
    const [reset, setReset] = useState('');
    const [method, setMethod] = useState('get');
    const defaultUrl="http://localhost:8080/api/v1/person/";
    const [url, setUrl] = useState(defaultUrl);

    const personId = +props.match.params.id;
    const [id,setId] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [dob,setDob] = useState('');
    const [bio,setBio] = useState('');
    const [photoUrl,setPhotoUrl] = useState('');
    

    useEffect(() => {
        try {
        setId('');setFirstName('');setLastName('');setDob('');setBio('');setPhotoUrl('');
             
        } catch (error) {
            console.log(error);
         }
    },[reset]);

    useEffect(() => {
        try {
                switch(method){
                    case 'post' || 'put' :
                        let person = {
                            id: id,
                            firstName: firstName, 
                            lastName: lastName, 
                            dob: dob, 
                            bio: bio, 
                            photoUrl:photoUrl
                        };
                        axios.post(url,person)
                        .then((response) => {
                            setShow(true);
                            setTimeout(() => setShow(false),3000);
                            setReset('1');
                        });break;
                    case 'get':
                        
                        let cUrl = (personId > 0) ? url+personId : url;
                        axios.get(cUrl)
                        .then((response) => {
                            if(response.data !=null){
                                setId(response.data.id);
                                setFirstName(response.data.firstName);
                                setLastName(response.data.lastName);
                                setDob(response.data.dob);
                                setBio(response.data.bio);
                                setPhotoUrl(response.data.photoUrl);
                            }   
                        });break;  
                    default:break;    
                }   
        } catch (error) {
            console.log(error);
        }
    }, [url]);
 
        return(
            <div>
                <div style={{"display": show ? "block" : "none"}}>
                    <SuccessToast show ={show} message={method ==="put" ? "Person Updated Successfully." : "Person Saved Successfully."} type={"success"}/>
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={id ? faEdit : faPlusSquare} /> {id ? "Update Person" : "Add New Person"}</Card.Header>
                    <Form onReset={() =>{setReset('1')}} id="personFormId" onSubmit={ (e) =>{setUrl("http://localhost:8080/api/v1/person");setMethod("post");e.preventDefault(); } }>
                        <Card.Body>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={firstName}
                                    onChange={event => setFirstName(event.target.value)}
                                    name="firstName"
                                    placeholder="Enter First Name" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={lastName}
                                    onChange={event => setLastName(event.target.value)}
                                    name="lastName"
                                    placeholder="Enter Last Name" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="dob">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dob}
                                    onChange={event => setDob(event.target.value)}
                                    name="dob"
                                    placeholder="Enter DOB" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="photoUrl">
                                <Form.Label>Photo Url</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={photoUrl}
                                    onChange={event => setPhotoUrl(event.target.value)}
                                    name="photoUrl"
                                    placeholder="Enter Photo Url" required autoComplete="off" />
                            </Form.Group>
                            <Form.Group controlId="bio">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control as="textarea"
                                    name="bio"
                                    value={bio}
                                    onChange={event => setBio(event.target.value)}
                                    rows="3" required autoComplete="off" />
                            </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave} /> {id ? "Update" : "Save"} 
                        </Button>{' '}
                        <Button size="sm" variant="info" type="reset">
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
