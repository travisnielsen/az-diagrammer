import './App.css'
import { MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import Layout from "./components/Layout";

type AppProps = {
  pca: IPublicClientApplication;
};

const App = ({ pca }: AppProps) => {

  return (
      <MsalProvider instance={pca}>
          <Layout />
      </MsalProvider>
  );

}

export default App
