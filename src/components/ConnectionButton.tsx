import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import AddConnection from './AddConnection';
import EditConnections from './EditConnections';
import { useAppDispatch, useAppSelector } from '../hooks';
import { StorageAccountConnection } from '../types/StorageAccountConnection';
import { setSelectedConnection } from '../features/connectionsSlice';

const ConnectionButton = () => {

    const dispatch = useAppDispatch()
    const [modalShow, setModalShow] = useState(false);
    const [editConnectionModel, setModalShowEditConnections] = useState(false);

    const name: string = useAppSelector((state: any) => {
        if (state.connections.value.filter((c: { selected: any; }) => c.selected).length === 0) {
            return "Select connection...";
        }
        return state.connections.value.filter((c: { selected: any; }) => c.selected)[0].name
    })

    const connections: StorageAccountConnection[] = useAppSelector((state: any) => state.connections.value)

    function handleSelect(e: any, id: string) {
        dispatch(setSelectedConnection(id))
    }

    const renderedListItems = connections.map(connection => {
        const href = "#/" + connection.name.replace(" ", "-");
        const key = connection.id;
        return <Dropdown.Item href={href} key={key} onClick={(e) => handleSelect(e, connection.id)}>{connection.name}</Dropdown.Item>
    })

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle id="dropdown-button-dark-example1" variant="dark">
                {name}
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                    {renderedListItems}
                    <Dropdown.Divider />
                    <Dropdown.Item key="addConnection" href="#/action-1" onClick={() => setModalShow(true)}>Add</Dropdown.Item>
                    <Dropdown.Item key="editConnections" href="#/action-2" onClick={() => setModalShowEditConnections(true)}>Edit</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <AddConnection setmodalshow={setModalShow} show={modalShow} onHide={() => setModalShow(false)}/>
            <EditConnections setmodalshow={setModalShowEditConnections} show={editConnectionModel} onHide={() => setModalShowEditConnections(false)}/>
        </>
    )

};

export default ConnectionButton;