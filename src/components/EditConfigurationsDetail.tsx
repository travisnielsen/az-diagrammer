import { useState } from "react";
import { Button, Form, ModalProps } from "react-bootstrap";
import { removeConfiguration, updateConfiguration } from "../features/configurationSlice";
import { useAppDispatch } from "../hooks";


const EditConfigurationsDetail = (props: ModalProps) => {

    // TODO: There must be a better way to do this using the StorageAccountConnection type
    // const [connectionInfo, setConnectionInfo] = useState((props.connection) as StorageAccountConnection);
    
    const dispatch = useAppDispatch()
    const [configurationName, setConfigurationName] = useState(props.configuration.name);
    const [subscriptionId, setSubscriptionId] = useState(props.configuration.subscriptionId);
    const [excludeTags, setExcludeTags] = useState(props.configuration.excludeTags);
    const [connectionString, setConnectionString] = useState(props.configuration.connectionString);
    const [containerName, setContainerName] = useState(props.configuration.containerName);
    const [folderName, setFolderName] = useState(props.configuration.folderName);

    function handleUpdate() {
        dispatch(updateConfiguration({
            id: props.configuration.id,
            name: configurationName,
            subscriptionId: subscriptionId,
            excludeTags: excludeTags,
            connectionString: connectionString,
            containerName: containerName,
            selected: props.connection.selected,
            folderName: folderName
        }));

        if (props.onHide) {props.onHide(); }
    }

    function handleDelete() {
        dispatch(removeConfiguration({
            id: props.configuration.id,
            name: configurationName,
            subscriptionId: subscriptionId,
            excludeTags: excludeTags,
            connectionString: connectionString,
            containerName: containerName,
            selected: props.configuration.selected,
            folderName: folderName
        }));
    }

    return (
        <>
            <Form>
                <Form.Group className="mb-3" controlId="formConfigurationName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control readOnly value={configurationName} onChange={e => setConfigurationName(e.target.value) }/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formSubscriptionId">
                    <Form.Label>Subscription ID</Form.Label>
                    <Form.Control value={subscriptionId} onChange={e => setSubscriptionId(e.target.value) }/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formExcludeTags">
                    <Form.Label>Exclude Tags</Form.Label>
                    <Form.Control type="text" defaultValue={excludeTags} onChange={e => setExcludeTags(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStorageAcctConnectionString">
                    <Form.Label>Connection String</Form.Label>
                    <Form.Control type="text" defaultValue={connectionString} onChange={e => setConnectionString(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStorageAcctContainer">
                    <Form.Label>Container</Form.Label>
                    <Form.Control type="text" defaultValue={containerName} onChange={e => setContainerName(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formFolderName">
                    <Form.Label>Folder</Form.Label>
                    <Form.Control type="text" defaultValue={folderName} onChange={e => setFolderName(e.target.value)}/>
                </Form.Group>
            </Form>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button key="deleteButton" onClick={handleDelete} variant="outline-danger">Delete</Button>{' '}
            <Button key="saveButton" onClick={handleUpdate}>Save</Button>
            </div>
        </>
    )
}

export default EditConfigurationsDetail;
