import authService from '../api-authorization/AuthorizeService'

class requests {

    static getPhones() {
        const url = "api/phones"
        return this.makeRequest(url, "get", {})
    }

    static getVideos(deviceId) {
        const url = "api/videos/" + deviceId
        return this.makeRequest(url, "get", {})
    }

    static getLocations(deviceId) {
        const url = "api/Locations/" + deviceId
        return this.makeRequest(url, "get", {})
    }

    static getCallLogs(deviceId) {
        const url = "api/Calllogs/" + deviceId
        return this.makeRequest(url, "get", {})
    }
    static getMessages(deviceId) {
        const url = "api/sms/" + deviceId
        return this.makeRequest(url, "get", {})
    }
    static getRequests(deviceId) {
        const url = "api/requests/allRequests/" + deviceId
        return this.makeRequest(url, "get", {})
    }
    static getImages(deviceId) {
        const url = "api/image/" + deviceId
        return this.makeRequest(url, "get", {})
    }
    static encryptPhone(deviceId) {
        const url = "api/requests/" + deviceId
        return this.makeRequest(url, "post", { PhoneRefId: deviceId, RequestId: 1, Status:1 })
    }
    static decryptPhone(deviceId) {
        const url = "api/requests/" + deviceId
        return this.makeRequest(url, "post", { PhoneRefId: deviceId, RequestId: 2, Status: 1 })
    }
    static resetPhone(deviceId) {
        const url = "api/requests/" + deviceId
        return this.makeRequest(url, "post", { PhoneRefId: deviceId, RequestId: 3, Status: 1 })
    }  
    static removePhone(deviceId) {
        const url = "api/phones/" + deviceId
        return this.makeRequest(url, "delete", {})
    }  
    static updateMessagesRequest(deviceId) {
        const url = "api/requests/" + deviceId
        return this.makeRequest(url, "post", { PhoneRefId: deviceId, RequestId: 4, Status: 1 })
    }  
    static updateCalllogsRequest(deviceId) {
        const url = "api/requests/" + deviceId
        return this.makeRequest(url, "post", { PhoneRefId: deviceId, RequestId: 5, Status: 1 })
    }
    static liveVideoRequest(deviceId) {
        const url = "api/requests/" + deviceId
        return this.makeRequest(url, "post", { PhoneRefId: deviceId, RequestId: 6, Status: 1 })
    }
    static keepStreaming(deviceId) {
        const url = "api/requests/streamStatus/" + deviceId
        return this.makeRequest(url, "post", {})
    } 
    static checkLiveStream(deviceId) {
        const url = "api/requests/liveStream/" + deviceId
        return this.makeRequest(url, "get", {})
    } 
    static record(deviceId) {
        const url = "api/videos/record/" + deviceId
        return this.makeRequest(url, "post", {})
    } 
    static stopRecord(deviceId,vidId) {
        const url = "api/videos/stoprecord/" + deviceId + "/" +vidId
        return this.makeRequest(url, "post", {})
    } 
    static async  makeRequest(url, method, body) {
        const token = await authService.getAccessToken();
        console.log(token)
        if (method === "get") {
            const response = await fetch(url, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            if (response.status===200) {
                const data = await response.json();
                return { data: data, status: response.status };
            }
            return {status:response.status}

        }
        else if (method === "post") {
            const response = await fetch(url, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                method: "post",
                body: JSON.stringify(body)

            });

            if (response) {
                let data;
                try {
                    data = await response.json();
                } catch (ex) {

                }
                return { data: data, status: response.status };

            }
            return { status: response.status }
        } else if (method === "delete") {
            const response = await fetch(url, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                method: "delete",
                body: JSON.stringify(body)

            });
            if (response) {
                const data = await response.json();
                return { data: data, status: response.status };

            }
            return { status: response.status }
        }
    }


}
export default requests