/// <reference path="./typings/modules/thing-if-sdk/index.d.ts" />
/// <reference path="./typings/globals/mocha/index.d.ts" />

import * as ThingIF from 'thing-if-sdk';

describe("Usage Test", function () {
    it ("Onboardings", function(done) {
        const app: ThingIF.App = new ThingIF.App("appID", "appKey", "JP");
        const owner: ThingIF.TypedID = new ThingIF.TypedID(ThingIF.Types.User, "dummyID");
        const api: ThingIF.ThingIFAPI = new ThingIF.ThingIFAPI(owner, "dummYToken", app);
        const onboardReq = new ThingIF.OnboardWithVendorThingIDRequest("vendorThingID", "password");
        api.onboardWithVendorThingID(onboardReq).then(function (params:any) {
            
        });
        
    });
});