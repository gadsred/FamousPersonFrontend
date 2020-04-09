import React, {useState, useEffect } from 'react';

import { Card, Table, Image, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faTrash, faEdit,faArrowDown,faArrowUp} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SuccessToast from './SuccessToast';


export default function PersonList () {
  const [data, setData] = useState({ persons: [] });
  const [show, setShow] = useState(false);
  const [kword, setKword] = useState('');
 
    function handleClick(info,method)
    {
        switch(method)
        {
            case 'delete':
                axios.delete("http://localhost:8080/api/v1/person/"+info)
                .then((response) => {
                    setShow(true);
                    axios.get("http://localhost:8080/api/v1/person").then((response) => {setData(response.data); });
                    const timer = setTimeout(() => {
                        setShow(false);
                        clearTimeout(timer);
                    }, 1000);
                    
                });
                break;
            case 'get':
                let url = kword ==="" ? "http://localhost:8080/api/v1/person":"http://localhost:8080/api/v1/person/search/"+info;
                axios.get(url)
                .then((response) => {
                    setData(response.data);  
                });
                break;
            default:break;
        }
        
    }

    function sort(s){
        try {

            setData(Object.values(data).sort((a, b)=>{
                const reversed = (s === "asc") ? 1 : -1;
                return reversed * (a.lastName+a.firstName).localeCompare(b.lastName+b.firstName);
            }));
                
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        try {
                axios.get("http://localhost:8080/api/v1/person")
                .then((response) => {
                    setData(response.data); 
                });  
        } catch (error) {
            console.log(error);
        }
    },[]);

    
    


  return (
        <div>
            {show ? 
            <div style={{ "display": show ? "block" : "none" }}>
                <SuccessToast show = {show} message = {"Person was Deleted Successfully."} type = {"danger" } />
            </div>:''
            }
            <Card className={"border border-dark bg-dark text-white"}>
                <Card.Header><FontAwesomeIcon icon={faList} /> Person List</Card.Header>
                <Card.Body>
                <InputGroup className="mb-3">
                    <FormControl
                        type="text"
                        value={kword}
                        onChange={(e) =>{setKword(e.target.value)}}
                        name="kword"
                        placeholder="Search First and Last Name"
                        aria-label="Search First and Last Name"
                        aria-describedby="basic-addon2"
                    />
                    <InputGroup.Append>
                   <Button onClick={() =>{handleClick(kword,'get')}} className={"text-white"} variant="outline-secondary">Search</Button>
                    </InputGroup.Append>
                </InputGroup>
                    Sorting(Last Name, First Name):{' '} 
                     <ButtonGroup>
                        <Button size="sm" variant="outline-primary" onClick={() =>{sort('asc')}}><FontAwesomeIcon icon={faArrowUp} /></Button>
                        <Button size="sm" variant="outline-primary" onClick={() =>{sort('desc')}}><FontAwesomeIcon icon={faArrowDown} /></Button>
                    </ButtonGroup>
                    <Table striped bordered hover variant="dark" responsive>
                        <thead>
                            <tr align="center">
                                <th>Photo</th>
                                <th>Last Name</th>
                                <th>First Name</th>
                                
                                <th>Date of Birth</th>
                                <th>Bio</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.values(data).length === 0 ?
                                    <tr align="center">
                                        <td colSpan="6">No Persons Available</td>
                                    </tr> :
                                    Object.values(data).map((person,i) => (
                                        <tr key={i} align="center">
                                            <td>
                                                <Image src={person.photoUrl}  width="100" height="115" rounded />
                                            </td>
                                            
                                            <td>{person.lastName}</td>
                                            <td>{person.firstName}</td>
                                            <td>{person.dob}</td>
                                            <td>{person.bio}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Link to={"edit/"+person.id} className="btn btn-sm btn-outline-primary"><FontAwesomeIcon icon={faEdit} /></Link>{' '}
                                                    <Button size="sm" variant="outline-danger" onClick={() =>{handleClick(person.id,'delete')}}><FontAwesomeIcon icon={faTrash} /></Button>
                                                </ButtonGroup>

                                            </td>
                                        </tr>
                                    ))

                            }

                        </tbody>
                    </Table>
                </Card.Body>
                {/* <Card.Footer>
                    <div style={{"float":"left"}}>
                            Showing Page {currentPage} of {totalPages}
                    </div>
                    <div style={{"float":"right"}}>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button disabled={currentPage === 1 ? true : false}
                                        onClick={this.firstPage}>
                                        <FontAwesomeIcon icon={faFastBackward} /> Fist
                                    </Button>
                                    <Button disabled={currentPage === 1 ? true : false}
                                        onClick={this.prevPage}>
                                        <FontAwesomeIcon icon={faStepBackward} /> Prev
                                    </Button>
                                </InputGroup.Prepend>
                                <FormControl style={pageNumCss} name="currentPage" value={currentPage}
                                    onChange={this.changePage}/>
                                <InputGroup.Append>
                                    <Button disabled={currentPage === totalPages ? true : false}
                                        onClick={this.nextPage}>
                                        <FontAwesomeIcon icon={faStepForward} /> Next   
                                    </Button> 
                                    <Button disabled={currentPage === totalPages ? true : false}
                                        onClick={this.lastPage}>
                                        <FontAwesomeIcon icon={faFastForward} /> Last 
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                    </div>
                </Card.Footer>*/}
            </Card> 
        </div>
    );
}