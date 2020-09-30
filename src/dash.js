import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import Memos from './memos.js';

const hardcodedUser = 'nwei';
const hardcodedURL = 'http://localhost:8080/user/' + hardcodedUser + '/memo';

class Dash extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addMemo: {
                isVisible: false,
            },
            memos: [],
        };

        this.getMemos().then((memos) => {
            this.setState({
                addMemo: this.state.addMemo,
                memos: memos,
            });
        });
    };

    async getMemos() {
        const response = await fetch(hardcodedURL, {
            method: 'GET',
        })
        .catch((err) => console.error(err));
        return response.json();
    };

    async putMemo(memo) {
        const response = await fetch(hardcodedURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memo),
        })
        .catch((err) => console.error(err));
        return response;
    };

    handleChangeMemoTitle(event) {
        if (event.target.value.length > 0 && !this.state.addMemo.isVisible) {
            this.setState({
                addMemo: {
                    isVisible: true,
                },
                memos: this.state.memos,
            });
        } else if (event.target.value.length === 0) {
            this.setState({
                addMemo: {
                    isVisible: false,
                },
                memos: this.state.memos,
            });
        }
    };

    handleClickNewMemo() {
        let newMemo = {
            memo_id: Date.now().toString(),
            user_id: hardcodedUser,
            title: document.getElementById('new-memo-title').value,
            content: document.getElementById('new-memo-content').value,
            isVisible: true,
        };
        this.setState({
            addMemo: this.state.addMemo,
            memos: this.state.memos.concat([newMemo]),
        });

        this.putMemo(newMemo).then((data) => console.log('put new memo: ', data));
    };

    toggleMemoIsVisible(i) {
        let memos = this.state.memos.slice();
        memos[i].isVisible = !memos[i].isVisible;
        this.setState({
            addMemo: this.state.addMemo,
            memos: memos,
        });
    };

    render() {
        const memos = this.state.memos.slice();

        return (
            <Container>
                <Row><Col><h3>Memos</h3></Col></Row>
                <Row>
                    <InputGroup size='lg'>
                        <FormControl id='new-memo-title' placeholder='title' onChange={(e)=>this.handleChangeMemoTitle(e)}/>
                        <InputGroup.Append><Button variant='success' onClick={()=>this.handleClickNewMemo()}><b>+</b></Button></InputGroup.Append>
                    </InputGroup>
                </Row>
                <Collapse in={this.state.addMemo.isVisible}>
                    <Row><InputGroup size='lg'><FormControl id='new-memo-content' as='textarea' placeholder='content'/></InputGroup></Row>
                </Collapse>
                <Row><h5>---</h5></Row>
                <Row><Col><Memos data={memos} handleClick={(i)=>this.toggleMemoIsVisible(i)}/></Col></Row>
            </Container>
        );
    };
};

export default Dash;