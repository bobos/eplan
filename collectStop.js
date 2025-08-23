"use strict";
async function r(city, pageNum) {
    const reqUrl = `https://restapi.amap.com/v5/place/text?types=180300&key=d0e0aab6356af92b0cd0763cae27ba35&output=json&region=${city}&page_size=25&page_num=${pageNum}`;
    let response = await fetch(reqUrl);
    if (!response.ok)
        throw new Error(`network response was not ok ${response.statusText}`);
    try {
        response = await response.json();
        if (response && response.count > 0) {
            return response.pois;
        }
        return false;
    }
    catch (e) {
        throw e;
    }
}
async function collectService(city, pageNum = 1, allService = []) {
    let ret = await r(city, pageNum);
    if (!ret) {
        let all = [];
        let stops = {};
        allService.forEach(poi => {
            const name = poi.name;
            if (!all.includes(name)) {
                all.push(name);
                let sub = stops[poi.adname];
                const item = `{name: '${name}', location: '${poi.location}', altitude: }`;
                if (!sub)
                    stops[poi.adname] = [item];
                else
                    sub.push(item);
            }
        });
        console.log(stops);
        return;
    }
    await collectService(city, pageNum + 1, allService.concat(ret));
}
