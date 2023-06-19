import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import AddConnection from './AddConnection';
import EditConnections from './EditConnections';
import { useAppDispatch, useAppSelector } from '../hooks';
import { StorageAccountConnection } from '../types/StorageAccountConnection';
import { setSelectedConnection } from '../features/connectionsSlice';
import { setVisibleNodes, setVisibleEdges } from '../features/diagramSlice'
import { loadCanvasData } from '../data/loadCanvasData';

import { useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const ConnectionButton = () => {

    const { instance, accounts, inProgress } = useMsal();
    const account = useAccount(accounts[0] || {});

    const dispatch = useAppDispatch()
    const [modalShow, setModalShow] = useState(false);
    const [editConnectionModel, setModalShowEditConnections] = useState(false);

    const selectedConnection: StorageAccountConnection = useAppSelector((state: any) => {
        if (state.connections.value.filter((c: { selected: any; }) => c.selected).length === 0) {
            return "Select connection...";
        }
        return state.connections.value.filter((c: { selected: any; }) => c.selected)[0]
    })

    // called when the selected connection changes
    useEffect(() => {
        
        const fetchData = async () => {
            const [canvasNodes, canvasEdges] = await loadCanvasData(selectedConnection.connectionString, selectedConnection.containerName);
            dispatch(setVisibleNodes(canvasNodes));
            dispatch(setVisibleEdges(canvasEdges));
        }

        const protectedResources = {
            azureStorage: {
                endpoint: "https://storage.azure.com",
                scopes: ["https://storage.azure.com/user_impersonation"],
            }
        }
        
        if (selectedConnection.name !== "Select connection...") {

            if (account && account.name) {

                let accessToken = "";

                instance.acquireTokenSilent({
                    scopes: protectedResources.azureStorage.scopes,
                    account: account,
                    
                }).then((response) => {
                    accessToken = response.accessToken;
                    fetchData();
                    console.log("fetching data");
                }).catch((error) => {
                    // in case if silent token acquisition fails, fallback to an interactive method
                    if (error instanceof InteractionRequiredAuthError) {
                        if (account && inProgress === "none") {
                            instance.acquireTokenPopup({
                                scopes: protectedResources.azureStorage.scopes,
                            }).then((response) => {
                                accessToken = response.accessToken;
                                fetchData();
                                console.log("fetching data");
                            }).catch(error => console.log(error));
                        }
                    }
                });

            }
        }

    }, [selectedConnection, account, inProgress, instance]);

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
                {selectedConnection.name}
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