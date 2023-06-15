
import { Interpolation, Theme } from '@emotion/react';
import { JSX } from '@emotion/react/jsx-runtime';
import { DetailedHTMLProps, HTMLAttributes, ReactNode, RefObject, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import { Omit, BsPrefixProps } from 'react-bootstrap/esm/helpers';
import AddConnection from './AddConnection';


const ConnectionButton = () => {

    const [modalShow, setModalShow] = useState(false);

    const name = "Select connection...";

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle id="dropdown-button-dark-example1" variant="dark">
                {name}
                </Dropdown.Toggle>

                <Dropdown.Menu variant="dark">
                    <Dropdown.Item href="#/action-1">Connection #1</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Connection #2</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#/action-3" onClick={() => setModalShow(true)}>Add</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Edit</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <AddConnection show={modalShow} onHide={() => setModalShow(false)}/>

        </>
    )

};

export default ConnectionButton;