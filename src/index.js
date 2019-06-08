import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <div>
        <Row style={{ padding: "33px 33px 0 33px" }} >
            <Col>
                <h1>Sign up to join our <span style={{ color: "#BD3039" }}>Boston</span> Network</h1> 
            </Col>
        </Row>
        <Row style={{ padding: 33 }}>
            <Col>
                <div style={{ maxWidth: 500 }}>
                    <App />
                </div>
            </Col>
        </Row>
    </div>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
