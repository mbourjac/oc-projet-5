export async function getData(endpoint) {
    try {
        const fullPath = setFullPath(endpoint);
        const response = await fetch(fullPath);
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log(error);
    }        
}

function setFullPath(endpoint) {
    const basePath = "http://localhost:3000/api/products";
    
    if (endpoint) {
        return basePath + "/" + endpoint;
    }

    return basePath;
}