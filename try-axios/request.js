

const request = async (callback) => {
    try {
        const res = await callback();
        if (res.code !== 0) throw new Error(res.msg);
        return [res.data, null];
    } catch (e) {
        message.error(e.message); 
        return [null, e];
    }
}

export default request;