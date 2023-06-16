import { useState } from "react";
import { StorageAccountConnection } from "../types/StorageAccountConnection";
import { Button, Form, ModalProps } from "react-bootstrap";
import { removeConnection, updateConnection } from "../features/connectionsSlice";
import { useAppDispatch } from "../hooks";


const ConnectionDetails = (props: ModalProps) => {

    const dispatch = useAppDispatch()
    const [connectionName, setConnectionName] = useState(props.connection.name);
    const [connectionString, setConnectionString] = useState(props.connection.connectionString);
    const [containerName, setContainerName] = useState(props.connection.containerName);

    function handleUpdate() {
        dispatch(updateConnection({name: connectionName, connectionString: connectionString, containerName: containerName}));
        props.setmodalshow(false);
    }

    function handleDelete() {
        dispatch(removeConnection({name: connectionName, connectionString: connectionString, containerName: containerName}));
        props.setmodalshow(false);
    }

    return (
        <>
            <Form>
                <Form.Group className="mb-3" controlId="formConnectionName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control readOnly value={connectionName} onChange={e => setConnectionName(e.target.value) }/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStorageAcctConnectionString">
                    <Form.Label>Connection String</Form.Label>
                    <Form.Control type="text" defaultValue={connectionString} onChange={e => setConnectionString(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStorageAcctContainer">
                    <Form.Label>Container</Form.Label>
                    <Form.Control type="text" defaultValue={containerName} onChange={e => setContainerName(e.target.value)}/>
                </Form.Group>
            </Form>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button key="deleteButton" onClick={handleDelete} variant="outline-danger">Delete</Button>{' '}
            <Button key="saveButton" onClick={handleUpdate}>Save</Button>
            </div>
        </>
    )
}

export default ConnectionDetails;
