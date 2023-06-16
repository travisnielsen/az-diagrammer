import { Button, Form, Modal, ModalProps } from "react-bootstrap";
import { addConnection } from "../features/connectionsSlice";
import { useAppDispatch } from '../hooks'
import { useState } from "react";

const AddConnection = (props: ModalProps ) => {

    const dispatch = useAppDispatch()
    const [connectionName, setConnectionName] = useState("");
    const [connectionString, setConnectionString] = useState("");
    const [containerName, setContainerName] = useState("");

    function handleSave() {
        dispatch(addConnection({name: connectionName, connectionString: connectionString, containerName: containerName}));
        props.setmodalshow(false);
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Connection
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="formConnectionName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Name of this connection"  onChange={e => setConnectionName(e.target.value) }/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStorageAcctConnectionString">
                    <Form.Label>Connection String</Form.Label>
                    <Form.Control type="text" placeholder="Storage Account connection string" onChange={e => setConnectionString(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStorageAcctContainer">
                    <Form.Label>Container</Form.Label>
                    <Form.Control type="text" placeholder="Storage Account container" onChange={e => setContainerName(e.target.value)}/>
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button onClick={handleSave}>Save</Button>
            <Button onClick={props.onHide}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      );
};

export default AddConnection;