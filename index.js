// create an empty modbus client
var ModbusRTU = require("modbus-serial");

var unitId = 1;

var inputRegisters = [];
var holdingRegisters = [];

var minInputAddress = 30001;
var maxInputAddress = 30100;

var minHoldingAddress = 40001;
var maxHoldingAddress = 40100;


function createRegisters() {

    inputRegisters = [];
    holdingRegisters = [];

    for (let index = minInputAddress; index < maxInputAddress; index++) {

        var reg = {
            addr: index,
            value: Math.floor(Math.random() * 65535)
        };

        inputRegisters.push(reg);
    }

    for (let index = minHoldingAddress; index < maxHoldingAddress; index++) {
        var reg = {
            addr: index,
            value: Math.floor(Math.random() * 65535)
        };
        holdingRegisters.push(reg);
    }
}

var vector = {
    getInputRegister: function (addr, unitID) {

        if (unitID === unitId && addr >= minInputAddress && addr < maxInputAddress) {
            var picked = inputRegisters.find(item => item.addr === addr);
            return picked.value;
        }
    },
    getHoldingRegister: function (addr, unitID) {
        if (unitID === unitId && addr >= minHoldingAddress && addr < maxHoldingAddress) {
            var picked = holdingRegisters.find(item => item.addr === addr);
            return picked.value;
        }
    },
    setRegister: function (addr, value) {
        if (addr >= minHoldingAddress && addr < maxHoldingAddress) {
            var foundIndex = holdingRegisters.findIndex(x => x.addr == addr); 
            if (foundIndex > -1) {
                var reg = {
                    addr: addr,
                    value: value
                };
                holdingRegisters[foundIndex] = reg;
            }
            return value;
        }
    }
};

createRegisters();
// set the server to answer for modbus requests
console.log("ModbusTCP listening on modbus://127.0.0.1:8502");

var serverTCP = new ModbusRTU.ServerTCP(vector, { host: "127.0.0.1", port: 8502, debug: true, unitID: 1 });

serverTCP.on("socketError", function (err) {
    console.error(err);
    serverTCP.close(closed);
});

function closed() {
    console.log("server closed");
}


setInterval(createRegisters, 10 * 1000);
