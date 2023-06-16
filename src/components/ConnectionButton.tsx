
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import AddConnection from './AddConnection';
import { useAppSelector } from '../hooks';
import { StorageAccountConnection } from '../types/StorageAccountConnection';

const ConnectionButton = () => {

    const [name, setName] = useState("Select connection...");
    const [modalShow, setModalShow] = useState(false);

    const connections: StorageAccountConnection[] = useAppSelector((state: any) => state.connections.value)


    function handleSelect(e: any) {
        setName(e.target.innerHTML);
    }

    const renderedListItems = connections.map(connection => {
        const href = "#/" + connection.name.replace(" ", "-");
        const key = connection.name.replace(" ", "-");
        return <Dropdown.Item href={href} key={key} onClick={handleSelect}>{connection.name}</Dropdown.Item>
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
                    <Dropdown.Item href="#/action-1" onClick={() => setModalShow(true)}>Add</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Edit</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <AddConnection setmodalshow={setModalShow} show={modalShow} onHide={() => setModalShow(false)}/>
        </>
    )

};

export default ConnectionButton;