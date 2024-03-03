import axios from 'axios';

//#region  //*=========== Submit Handler ===========
export async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log('formData', formData.get('index'));
        const data = await axios.post('/api/values', {
            index: formData.get('index'),
        });
        console.log(data.data);
    } catch (error) {
        console.error(error);
    }
}
//#endregion  //*======== Submit Handler ===========

//#region  //*=========== Get All Computed indexes and values ===========
export async function getValues() {
    try {
        const values = await axios.get<Record<string, string>>(
            '/api/values/current',
        );
        return values.data;
    } catch (error) {
        console.error(error);
        return {};
    }
}
//#endregion  //*======== Get All Computed indexes and values ===========

//#region  //*=========== Get All indexes that are computed ===========
export async function getSeenIndexes() {
    try {
        const seenIndexes =
            await axios.get<{ number: number }[]>('/api/values/all');
        return seenIndexes.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
//#endregion  //*======== Get All indexes that are computed ===========

