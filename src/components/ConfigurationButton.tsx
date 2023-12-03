import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import AddConfiguration from './AddConfiguration';
import EditConfigurations from './EditConfigurations';
import { useAppDispatch, useAppSelector } from '../hooks';
import { DiagramConfiguration } from '../types/DiagramConfiguration';
import { setSelectedConfiguration } from '../store/configurationSlice';
import { setVisibleNodes, setVisibleEdges, setHiddenNodes, setHiddenEdges } from '../store/diagramSlice'
import { loadCanvasData } from '../data/loadCanvasData';
import { useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const ConfigurationButton = () => {

    const { instance, accounts, inProgress } = useMsal();
    const account = useAccount(accounts[0] || {});

    const dispatch = useAppDispatch()
    const [modalShow, setModalShow] = useState(false);
    const [editConfigurationModal, setModalShowEditConfigurations] = useState(false);

    const selectedConfiguration: DiagramConfiguration = useAppSelector((state) => {
        /*
        if (state.configurations.value.filter((c: { selected }) => c.selected).length === 0) {
            return "Select connection...";
        }
        */
        return state.configurations.value.filter((c: { selected }) => c.selected)[0]
    })

    // called when the selected connection changes
    useEffect(() => {
        
        const fetchData = async () => {
            const [canvasNodesVisible, canvasNodesHidden, canvasEdgesVisible, canvasEdgesHidden] = await loadCanvasData(selectedConfiguration);
            dispatch(setVisibleNodes(canvasNodesVisible));
            dispatch(setVisibleEdges(canvasEdgesVisible));
            dispatch(setHiddenNodes(canvasNodesHidden));
            dispatch(setHiddenEdges(canvasEdgesHidden));        
        }

        const protectedResources = {
            azureStorage: {
                endpoint: "https://storage.azure.com",
                scopes: ["https://storage.azure.com/user_impersonation"],
            }
        }

        
        if (selectedConfiguration.name && selectedConfiguration.name !== "Select connection...") {

            if (selectedConfiguration.connectionString.toLowerCase() === "demo" && inProgress === "none") {
                fetchData();
                return;
            }

            if (selectedConfiguration.connectionString.includes("SharedAccessSignature") && inProgress === "none") {
                fetchData();
                return;
            }

            if (account && account.name) {

                // let accessToken = "";

                instance.acquireTokenSilent({
                    scopes: protectedResources.azureStorage.scopes,
                    account: account,
                    
                }).then(() => {
                    // accessToken = response.accessToken;
                    fetchData();
                    console.log("fetching data");
                }).catch((error) => {
                    // in case if silent token acquisition fails, fallback to an interactive method
                    if (error instanceof InteractionRequiredAuthError) {
                        if (account && inProgress === "none") {
                            instance.acquireTokenPopup({
                                scopes: protectedResources.azureStorage.scopes,
                            }).then(() => {
                                // accessToken = response.accessToken;
                                fetchData();
                                console.log("fetching data");
                            }).catch(error => console.log(error));
                        }
                    }
                });
            }
        }

    }, [selectedConfiguration, account, inProgress, instance, dispatch]);

    const configurations: DiagramConfiguration[] = useAppSelector((state) => state.configurations.value)

    function handleSelect(e, id: string) {
        console.log("handleSelect", e.target, id);
        dispatch(setSelectedConfiguration(id))
    }

    const renderedListItems = configurations.map(configuration => {
        const href = "#/" + configuration.name.replace(" ", "-");
        const key = configuration.id;
        return <Dropdown.Item href={href} key={key} onClick={(e) => handleSelect(e, configuration.id)}>{configuration.name}</Dropdown.Item>
    })

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle id="dropdown-button-dark-example1" variant="dark" size='sm'>
                {selectedConfiguration.name}
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                    {renderedListItems}
                    <Dropdown.Divider />
                    <Dropdown.Item key="addConfiguration" href="#/action-1" onClick={() => setModalShow(true)}>Add</Dropdown.Item>
                    <Dropdown.Item key="editConfigurations" href="#/action-2" onClick={() => setModalShowEditConfigurations(true)}>Edit</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <AddConfiguration show={modalShow} onHide={() => setModalShow(false)}/>
            <EditConfigurations show={editConfigurationModal} onHide={() => setModalShowEditConfigurations(false)}/>
        </>
    )

};

export default ConfigurationButton;