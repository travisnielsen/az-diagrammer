import { Modal, ModalProps, ListGroup, Container, Row, Col} from "react-bootstrap";
import { useAppSelector } from '../hooks';
import { DiagramConfiguration } from '../types/DiagramConfiguration';
import { useState } from "react";
import EditConfigurationsDetail from "./EditConfigurationsDetail";

const EditConfigurations = (props: ModalProps) => {

    const configurations: DiagramConfiguration[] = useAppSelector((state: any) => state.configurations.value)
    const [selectedConfiguration, setSelectedConfiguration] = useState<DiagramConfiguration>(configurations[0]);

    const renderedConfigurationItems = configurations.map(configuration => {
        const href = "#/" + configuration.name.replace(" ", "-");
        const key = configuration.name.replace(" ", "-");
        return <ListGroup.Item action href={href} key={key} onClick={() => setSelectedConfiguration(configuration)}>{configuration.name}</ListGroup.Item>
    })

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Configurations
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
                <Row>
                    <Col>
                        <ListGroup>
                            {renderedConfigurationItems}
                        </ListGroup>
                    </Col>
                    <Col xs={8}>
                      {selectedConfiguration ? <EditConfigurationsDetail key={selectedConfiguration.name} configuration={selectedConfiguration} setmodalshow={props.setmodalshow} /> : <></> }
                    </Col>
                </Row>
            </Container>
          </Modal.Body>
        </Modal>
      );
}

export default EditConfigurations;