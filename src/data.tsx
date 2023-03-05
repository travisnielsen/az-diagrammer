import vnetData from "./data/vnets.json"
import configData from "./config.json"

const loadData = () => {
    const vnets = vnetData.filter(vnet => vnet.Location.includes(configData.region) )
    return vnets
}

export default loadData