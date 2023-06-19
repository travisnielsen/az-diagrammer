import { useEffect, useState } from "react";
import { ButtonGroup } from "react-bootstrap";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { useMsal, useAccount } from "@azure/msal-react";

export const AccountButton = () => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [name, setName] = useState("");

    useEffect(() => {
        if (account && account.name) {
            setName(account.name);
        }
         else {
            setName("");
        }  
    }, [account]);

    const handleLogout = (logoutType: string) => {

        if (logoutType === "popup") {
            instance.logoutPopup({
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect();
        }
    }

    return (
        <ButtonGroup>
            <DropdownButton as={ButtonGroup} title={name} id="bg-nested-dropdown" variant="dark">
                <Dropdown.Item eventKey="1" onClick={() => handleLogout("redirect")}>Sign out</Dropdown.Item>
            </DropdownButton>
        </ButtonGroup>
    )
};