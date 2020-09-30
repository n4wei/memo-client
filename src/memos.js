import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';

const timeOpts = {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};

function Memo(props) {
    let prefix = '[ ' + new Date(Number(props.data.memo_id)).toLocaleString('en-US', timeOpts) + ' ] ';

    return (
        <ListGroup.Item action onClick={props.handleClick}>
            {prefix}<b>{props.data.title}</b>
            <Collapse in={props.data.isVisible}><div>{props.data.content}</div></Collapse>
        </ListGroup.Item>
    );
};

function Memos(props) {
    let memos = props.data.map((memo, i) => {
        return <Memo key={'memo-'+i} data={memo} handleClick={()=>props.handleClick(i)}></Memo>;
    });

    return <ListGroup>{memos}</ListGroup>;
};

export default Memos;