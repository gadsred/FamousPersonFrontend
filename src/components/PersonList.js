import React, {Component} from 'react';
import { Card, Table, Image, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faList, faTrash, faEdit, faStepForward, faStepBackward, faFastForward, faFastBackward,faArrowDown,faArrowUp} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SuccessToast from './SuccessToast';
import { InputGroupPrepend, InputGroupAppend } from 'react-bootstrap/InputGroup';


export default class PersonList extends Component{
    constructor(props){
        super(props);
        this.state={
            persons:[],
            currentPage: 1,
            personPerPage: 15,
            sortType:''
        };
    }

    componentDidMount(){
        this.findAllPersons();
    }

    findAllPersons(){
        axios.get("http://localhost:8080/api/v1/person")
            .then(response => response.data)
            .then((data) => {
                this.setState({persons:data});        
            });
    };

    searchPerson = (name) => {
        const url = (name) ? "http://localhost:8080/api/v1/person/search/"+name : "http://localhost:8080/api/v1/person"
        axios.get(url)
            .then(response => response.data)
            .then((data) => {
                this.setState({persons:data});        
            });
    };

    deletePerson = (personId) =>{
        axios.delete("http://localhost:8080/api/v1/person/"+personId)
            .then( response =>{
                if(response.status == 200)
                {
                    this.setState({"show":true});
                    setTimeout(() => this.setState({"show":false}),3000);
                   
                    this.setState({
                        persons: this.state.persons.filter(person => person.id !== personId)
                    });
                }else{
                    this.setState({"show":false});
                }
            });
    };

    changePage = event => {
        this.setState({
            [event.target.name]: parseInt(event.target.value)
        })
    };

    firstPage = () => {
        if(this.state.currentPage > 1)
        {
            this.setState({
                currentPage: 1
            });
        }
    };

    prevPage = () => {
        if(this.state.currentPage > 1)
        {
            this.setState({
                currentPage: this.state.currentPage - 1
            });
        }
    };

    nextPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.persons.length / this.state.personPerPage))
        {
            this.setState({
                currentPage: this.state.currentPage + 1
            });
        }
    };

    lastPage = () => {
        if(this.state.currentPage < Math.ceil(this.state.persons.length / this.state.personPerPage))
        {
            this.setState({
                currentPage: Math.ceil(this.state.persons.length / this.state.personPerPage)
            });
        }
    };

    sortAsc = () => {
       this.setState({sortType:'asc'});
    };

    sortDesc = () => {
        this.setState({sortType:'desc'});
     };

     
    kwordChange = event =>{
        this.setState({
            [event.target.name]:event.target.value
        });
    };

    

    render(){

        const {persons, currentPage, personPerPage} = this.state;
        const lastIndex = currentPage * personPerPage; 
        const firstIndex  = lastIndex - personPerPage;
        const currentPersons = persons.slice(firstIndex, lastIndex);
        const totalPages = persons.length / personPerPage;

        const sortedPersons = persons.sort((a, b)=>{
                const reversed = (this.state.sortType === "asc") ? 1 : -1;
                return reversed * a.lastName.localeCompare(b.lastName && b.firstName);
        });
        
        const pageNumCss = {
            width:"45px",
            border:"1px solid #17a2B8",
            color:"#17a2B8",
            textAlign:"center",
            fontWeight:"bold"
        };

        return(
            <div>
                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show = {this.state.show} message = {"Person was Deleted Successfully."} type = {"danger" } />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header><FontAwesomeIcon icon={faList} /> Person List</Card.Header>
                    <Card.Body>
                    <InputGroup className="mb-3">
                        <FormControl
                            type="text"
                            value={this.state.kword}
                            onChange={this.kwordChange}
                            name="kword"
                            placeholder="Search First and Last Name"
                            aria-label="Search First and Last Name"
                            aria-describedby="basic-addon2"
                        />
                        <InputGroup.Append>
                        <Button onClick={this.searchPerson.bind(this, this.state.kword)} className={"text-white"} variant="outline-secondary">Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                        Sorting(Last Name, First Name):{' '} 
                        <ButtonGroup>
                            <Button size="sm" variant="outline-primary" onClick={this.sortAsc}><FontAwesomeIcon icon={faArrowUp} /></Button>
                            <Button size="sm" variant="outline-primary" onClick={this.sortDesc}><FontAwesomeIcon icon={faArrowDown} /></Button>
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
                                    persons.length === 0 ?
                                        <tr align="center">
                                            <td colSpan="6">No Persons Available</td>
                                        </tr> :
                                        sortedPersons.map((person) => (
                                            <tr key={person.id} align="center">
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
                                                        <Button size="sm" variant="outline-danger" onClick={this.deletePerson.bind(this, person.id)}><FontAwesomeIcon icon={faTrash} /></Button>
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
    };
}

