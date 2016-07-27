/// <reference path="./typings/modules/thing-if-sdk/index.d.ts" />
/// <reference path="./typings/globals/mocha/index.d.ts" />

import * as ThingIF from 'thing-if-sdk';

describe("Usage Test", function () {
    const app: ThingIF.App = new ThingIF.App("appID", "appKey", "JP");
    const owner: ThingIF.TypedID = new ThingIF.TypedID(ThingIF.Types.User, "dummyID");
    const api: ThingIF.ThingIFAPI = new ThingIF.ThingIFAPI(owner, "dummYToken", app);
    it ("Shows how to Onboarding", function(done) {
        const onboardReq = new ThingIF.OnboardWithVendorThingIDRequest("vendorThingID", "password");
        api.onboardWithVendorThingID(onboardReq).then((result:ThingIF.OnboardingResult) => {
            console.log(result.accessToken);
            console.log(result.mqttEndPoint);
            console.log(result.thingID);
            const mqttEndPoint = result.mqttEndPoint;
            const host:string = mqttEndPoint.host;
            const topic:string = mqttEndPoint.mqttTopic;
            const username:string = mqttEndPoint.username;
            const password:string = mqttEndPoint.password;
            const port:number = mqttEndPoint.portTCP;
            const clientID:string = mqttEndPoint.mqttTopic;
            // Connect to MQTT with mqttEndPoint information.
        }).catch((error:Error) => {
            if (error instanceof ThingIF.HttpRequestError) {
                // REST Api returns error response.
                console.log(error.status);
            } else if (error.name == ThingIF.Errors.IlllegalStateError) {
                // Error caused by illegal state.
            } else if (error.name == ThingIF.Errors.ArgumentError) {
                // Error caused by invalid argument.
            } else {
                // Other error. Unexpected error happens.
            }
            done(error);
        });
    });

    it ("Shows how to send Command.", function(done){
        const actions = [{"turnPower" : {"power": true}}];
        const commandReq: ThingIF.PostCommandRequest = new ThingIF.PostCommandRequest("smart-light", 1, actions);
        api.postNewCommand(commandReq).then((command:ThingIF.Command) => {
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it ("Shows how to get Command.", function(done) {
        api.getCommand("dummyCommandID").then((command:ThingIF.Command) =>{
            console.log(command.commandState);
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it ("Shows how to list Commands.", function(done) {
        const opt:ThingIF.ListQueryOptions = new ThingIF.ListQueryOptions(10);
        api.listCommands(opt).then((result:ThingIF.QueryResult<ThingIF.Command>) => {
            // For example, filter Finished Commands.
            result.results.filter((c) => { return (c.commandState == ThingIF.CommandState.DONE)}).forEach((c) => {
                // Do something for commands which has been done.
            });
            if (result.hasNext) {
                // There's  next page need to be fetched.
            }
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it("Shows how to post Command Trigger", function(done) {
        const actions = [{"turnPower" : {"power": true}}];
        const condition:ThingIF.Condition = new ThingIF.Condition(new ThingIF.Equals("temperature", 20));
        const predicate:ThingIF.Predicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_FALSE_TO_TRUE);
        const req:ThingIF.CommandTriggerRequest = new ThingIF.CommandTriggerRequest("smart-light", 1, [actions], predicate);
        api.postCommandTrigger(req).then((trigger:ThingIF.Trigger) => {
            console.log(trigger.triggerID);
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it ("Shows how to post Server Code Trigger", function(done) {
        const serverCode:ThingIF.ServerCode = new ThingIF.ServerCode("myEndPoint");
        const condition:ThingIF.Condition = new ThingIF.Condition(new ThingIF.Equals("temperature", 20));
        const predicate:ThingIF.Predicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_FALSE_TO_TRUE);
        const req:ThingIF.ServerCodeTriggerRequest = new ThingIF.ServerCodeTriggerRequest(serverCode, predicate);
        api.postServerCodeTrigger(req).then((trigger:ThingIF.Trigger) => {
            console.log(trigger.triggerID);
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it ("Shows how to patch Command Trigger", function(done) {
        const condition:ThingIF.Condition = new ThingIF.Condition(new ThingIF.Equals("temperature", 30));
        const predicate:ThingIF.Predicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
        const req:ThingIF.CommandTriggerRequest = new ThingIF.CommandTriggerRequest("smart-light", 1, null, predicate);
        api.patchCommandTrigger("dummyTriggerID", req).then((trigger:ThingIF.Trigger) => {
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it ("Shows how to patch Server Code Trigger", function(done) {
        const condition:ThingIF.Condition = new ThingIF.Condition(new ThingIF.Equals("temperature", 30));
        const predicate:ThingIF.Predicate = new ThingIF.StatePredicate(condition, ThingIF.TriggersWhen.CONDITION_CHANGED);
        const req:ThingIF.ServerCodeTriggerRequest = new ThingIF.ServerCodeTriggerRequest(null, predicate);
        api.patchServerCodeTrigger("dummyTriggerID", req).then((trigger:ThingIF.Trigger) => {
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it ("Shows how to enable/disable Trigger", function(done) {
        api.enableTrigger("dummyTriggerID", true).then((trigger:ThingIF.Trigger) => {
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it("Shows how to get Trigger", function(done) {
        api.getTrigger("dummyTriggerID").then((trigger:ThingIF.Trigger) => {
            console.log(trigger.command.commandState);
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it("Shows how to list Triggers", function(done) {
        const opt:ThingIF.ListQueryOptions = new ThingIF.ListQueryOptions(10);
        api.listTriggers(opt).then((result:ThingIF.QueryResult<ThingIF.Trigger>) => {
            // For example, filter triggers has not been disabled.
            result.results.filter((t) => !t.disabled).forEach((t) => {
                // Do sometiong with active triggers.
            });
            if (result.hasNext) {
                // There's next page need to be fetched.
            }
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it("Shows how to delete Trigger", function(done) {
        api.deleteTrigger("dummyTriggerID").then((triggerID:string) => {
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it ("Shows how to list Triggered Server Code execution results", function(done) {
        const opt:ThingIF.ListQueryOptions = new ThingIF.ListQueryOptions(10);
        api.listServerCodeExecutionResults("dummyTriggerID", opt).then((result:ThingIF.QueryResult<ThingIF.ServerCodeResult>) => {
            // For example, filter failed server codes.
            result.results.filter((sr) => !sr.succeeded).forEach((sr) => {
                // Do something with the failed results.
            });
            if (result.hasNext) {
                // There's next page need to be fetched.
            }
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

    it("Shows how to change Vendor Thing ID", function(done) {
        api.updateVendorThingID("newVendorThingID", "newPassword").then(()=>{
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        })
    });

    it("Shows how to install Firebase Cloud Messaging to receive notification from Thing-IF", function(done){
        api.installFCM("deviceToken", false).then((installationID:string) => {
            console.log(installationID);
            done();
        }).catch((error:Error) => {
            // Handle error here.
            done(error);
        });
    });

});