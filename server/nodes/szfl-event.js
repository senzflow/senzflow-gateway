
module.exports = function(RED) {
    "use strict";

    function EventOutNode(n) {
        RED.nodes.createNode(this,n);
        this.eventType = n.eventType;
        this.qos = n.qos || null;
        this.retain = n.retain;
        this.broker = n.broker;
        var node = this;
        var counter = 0;

        var context = this.context().global;

        this.on("input",function(msg) {
            if (msg.qos) {
                msg.qos = parseInt(msg.qos);
                if ((msg.qos !== 0) && (msg.qos !== 1) && (msg.qos !== 2)) {
                    msg.qos = null;
                }
            }
            msg.qos = Number(node.qos || msg.qos || 0);
            msg.retain = node.retain || msg.retain || false;
            msg.retain = ((msg.retain === true) || (msg.retain === "true")) || false;
            if (node.eventType) {
                msg.eventType = node.eventType;
            }
            if ( msg.hasOwnProperty("payload")) {
                if (msg.hasOwnProperty("eventType") && (typeof msg.eventType === "string") && (msg.eventType !== "")) {
                    context.publishEvent(msg, function(err) {
                        if (err) {
                            //node.warn(err);
                            node.status({fill:"red",shape:"ring",text: `error: ${err.message||err}`});
                        } else {
                            counter++;
                            node.status({fill:"red",shape:"ring",text: "已发送"+counter+"事件"});
                        }
                    });  // send the message
                }
                else { node.warn(RED._("senzflow.errors.invalid-eventType")); }
            }
        });
    }

    RED.nodes.registerType("event out",EventOutNode);


    function EventInNode(n) {
        RED.nodes.createNode(this,n);
        this.eventType = n.eventType;

        var context = this.context().global;

        var counter = 0;

        var node = this;
        this.status({fill:"red",shape:"ring",text:"common.status.disconnected"});
        if (this.eventType) {
            context.subscribeEvent({eventType: this.eventType, qos: this.qos || 1},
                function (event) {
                    counter++;
                    node.status({fill: "red", shape: "ring", text: "已接收" + counter + "事件"});
                    node.send(event);
                }, this.id);
            node.status({fill:"green",shape:"dot",text:"subscribed"});
        }
        else {
            this.error(RED._("mqtt.errors.not-defined"));
        }
        this.on('close', function(done) {
            context.unsubscribeEvent({eventType: node.eventType}, node.id);
            done();
        });
    }
    RED.nodes.registerType("event in",EventInNode);

};
