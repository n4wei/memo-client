import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';

const hardcodedUser = 'nwei';
const hardcodedURL = 'http://localhost:8080/user/' + hardcodedUser + '/memo';

function Memo(props) {
    return (
        <ListGroup.Item action onClick={props.handleClick}>
            <b>{'[' + new Date(Number(props.memo.memo_id)).toISOString().slice(6, 10) + '] ' + props.memo.title}</b>
            <Collapse in={props.memo.isVisible}>
                <div>{props.memo.content}</div>
            </Collapse>
        </ListGroup.Item>
    );
};

class Memos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addMemo: {
                isVisible: false,
            },
            memos: [],
        };

        this.handleChangeAddMemoTitle = this.handleChangeAddMemoTitle.bind(this);
        this.handleClickAddMemo = this.handleClickAddMemo.bind(this);

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
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-cache',
        });
        return response.json();
    };

    async putMemo(memo) {
        const response = await fetch(hardcodedURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memo),
            cache: 'no-cache',
        });
        return response;
    };

    handleChangeAddMemoTitle(event) {
        const copyMemos = this.state.memos.slice();
        if (event.target.value.length > 0 && !this.state.addMemo.isVisible) {
            this.setState({
                addMemo: { isVisible: true },
                memos: copyMemos,
            });
        } else if (event.target.value.length === 0) {
            this.setState({
                addMemo: { isVisible: false },
                memos: copyMemos,
            });
        }
    };

    handleClickAddMemo() {
        var newMemo = {
            memo_id: Date.now().toString(),
            user_id: hardcodedUser,
            title: document.getElementById("add-memo-title").value,
            content: document.getElementById("add-memo-content").value,
            isVisible: false,
        };
        const copyMemos = this.state.memos.concat([newMemo]);
        this.setState({
            addMemo: this.state.addMemo,
            memos: copyMemos,
        });

        this.putMemo(newMemo).then((resp) => console.log("********************", resp));
    };

    toggleVisibleMemoContent(i) {
        const copyMemos = this.state.memos.slice();
        copyMemos[i].isVisible = !copyMemos[i].isVisible;
        this.setState({
            addMemo: this.state.addMemo,
            memos: copyMemos,
        });
    };

    render() {
        const memoList = this.state.memos.slice().map((memo, i) => {
            return (
                <Memo key={i} memo={memo} handleClick={() => this.toggleVisibleMemoContent(i)}></Memo>
            );
        });

        return (
            <Container>
                <Row>
                    <Col>
                        <h4>Memos</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup size="lg">
                            <FormControl id="add-memo-title" placeholder="title" onChange={this.handleChangeAddMemoTitle} />
                            <InputGroup.Append>
                                <Button variant="success" onClick={this.handleClickAddMemo}><b>+</b></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Row>
                <Collapse in={this.state.addMemo.isVisible}>
                    <Row>
                        <Col>
                            <InputGroup size="lg">
                                <FormControl id="add-memo-content" as="textarea" placeholder="content" />
                            </InputGroup>
                        </Col>
                    </Row>
                </Collapse>
                <Row>
                    <Col>
                        <ListGroup variant="flush">{memoList}</ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    };
};

ReactDOM.render(<Memos/>, document.getElementById('root'));