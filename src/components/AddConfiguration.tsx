import { Button, Form, Modal, ModalProps } from "react-bootstrap";
import { addConfiguration } from "../features/configurationSlice";
import { useAppDispatch } from '../hooks'
import { useState } from "react";

const AddConnection = (props: ModalProps ) => {

  const dispatch = useAppDispatch()
  const [configurationName, setConfigurationName] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [excludeTags, setExcludeTags] = useState("");
  const [connectionString, setConnectionString] = useState("");
  const [containerName, setContainerName] = useState("");
  const [folderName, setFolderName] = useState("");

    function handleSave() {
      dispatch(addConfiguration({
        id: window.crypto.randomUUID(),
        name: configurationName,
        subscriptionId: subscriptionId,
        excludeTags: excludeTags,
        connectionString: connectionString,
        containerName: containerName,
        folderName: folderName,
        selected: false
      }));
      if (props.onHide) {
        props.onHide();
      }
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Configuration
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formConfigurationName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Name of this connection"  onChange={e => setConfigurationName(e.target.value) }/>
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
                  <Form.Control type="text" placeholder="Storage Account connection string" onChange={e => setConnectionString(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formStorageAcctContainer">
                  <Form.Label>Container</Form.Label>
                  <Form.Control type="text" placeholder="Storage Account container" onChange={e => setContainerName(e.target.value)}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formFolderName">
                  <Form.Label>Folder</Form.Label>
                  <Form.Control type="text" placeholder="folder name" defaultValue={folderName} onChange={e => setFolderName(e.target.value)}/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide} variant="outline-secondary">Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </Modal.Footer>
        </Modal>
      );
};

export default AddConnection;