/// <reference path="./typings/modules/thing-if-sdk/index.d.ts" />
/// <reference path="./typings/globals/mocha/index.d.ts" />

import * as ThingIF from 'thing-if-sdk';

describe("Usage Test", function () {
    const app: ThingIF.App = new ThingIF.App("appID", "appKey", "JP");
    const owner: ThingIF.TypedID = new ThingIF.TypedID(ThingIF.Types.User, "dummyID");
    const api: ThingIF.ThingIFAPI = new ThingIF.ThingIFAPI(owner, "dummYToken", app);
    it ("Shows how to onboarding", function(done) {
        const onboardReq = new ThingIF.OnboardWithVendorThingIDRequest("vendorThingID", "password");
        api.onboardWithVendorThingID(onboardReq).then((result:ThingIF.OnboardingResult) => {
            console.log(result);
            done();
        }).catch((error:ThingIF.ThingIFError) => {
            // Handle error here.
            done(error);
        });
    });

    it ("Shows how to send command.", function(done){
        const actions = [{"turnPower" : {"power": true}}];
        const commandReq: ThingIF.PostCommandRequest = new ThingIF.PostCommandRequest("smart-light-v1", 1, actions);
        api.postNewCommand(commandReq).then((command:ThingIF.Command) => {
            done();
        }).catch((error:ThingIF.ThingIFError) => {
            // Handle error here.
            done(error);
        })
    });

});