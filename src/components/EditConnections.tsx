import { Modal, ModalProps, ListGroup, Container, Row, Col} from "react-bootstrap";
import { useAppSelector } from '../hooks';
import { StorageAccountConnection } from '../types/StorageAccountConnection';
import { useState } from "react";
import EditConnectionsDetail from "./EditConnectionsDetail";

const EditConnections = (props: ModalProps) => {

    const connections: StorageAccountConnection[] = useAppSelector((state: any) => state.connections.value)
    const [selectedConnection, setSelectedConnection] = useState<StorageAccountConnection>(connections[0]);

    const renderedConnectionItems = connections.map(connection => {
        const href = "#/" + connection.name.replace(" ", "-");
        const key = connection.name.replace(" ", "-");
        return <ListGroup.Item action href={href} key={key} onClick={() => setSelectedConnection(connection)}>{connection.name}</ListGroup.Item>
    })

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Connections
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
                <Row>
                    <Col>
                        <ListGroup>
                            {renderedConnectionItems}
                        </ListGroup>
                    </Col>
                    <Col xs={8}>
                      {selectedConnection ? <EditConnectionsDetail key={selectedConnection.name} connection={selectedConnection} setmodalshow={props.setmodalshow} /> : <></> }
                    </Col>
                </Row>
            </Container>
          </Modal.Body>
        </Modal>
      );
}

export default EditConnections;