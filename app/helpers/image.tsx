export const getImage = async (entityId: string): Promise<string> => {

    const res = await fetch(
        `http://postcard.skyscanner.io/api/v1/traveller-destination/${entityId}?&w=300&h=300&resize=crop&q=90`
    );
    const json = await res.json();
    const image = json.results[entityId].url

    return image;
}