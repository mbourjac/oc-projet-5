export async function getData(fetchPath) {
    try {
        const response = await fetch(fetchPath);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }        
}