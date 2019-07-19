const endpoint = {
    baseUrl: ""
};
var switches = [];
let sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
};

function removeFromSelect(select, value) {
    $("#" + select + " option[value='" + value + "']").remove();
}

function addToSelect(select, class_, value) {
    let sel = document.getElementById(select);
    if (sel) {
        removeFromSelect(select, value);
        let opt = document.createElement('option');
        opt.appendChild(document.createTextNode(""));
        opt.value = value;
        sel.appendChild(opt);
        $("#" + select + " option[value='" + value + "']").addClass(class_);

    }
}

function setOptionOnSelect(select, value) {
    let sel = document.getElementById(select);
    if (sel) {
        sel.selectedIndex = $("#" + select + " option[value='" + value + "']").index();
    }
}

function show(id) {
    $('#' + id).removeClass("hide");
}

function hide(id) {
    $('#' + id).addClass("hide");
}

var config;
var WORDS_EN = {
    "node": "NODE",
    "update": "UPDATE",
    "features": "FEATURES",
    "current-version": "Current version",
    "new-file": "Choose new version file",
    "install-new-version": "Install new version",
    "version": "Version",
    "save": "Save",
    "clean-fields": "Clear all Fields",
    "username": "Username",
    "password": "Password",
    "yes": "Yes",
    "no": "No",
    "netmask": "Netmask",
    "system": "System",
    "name": "Name",
    "restart": "Restart",
    "seconds":"seconds",
    "in":"in",
    "reset-factory": "Load Factory Defaults",
    "switches": "Switches",
    "remove": "Remove",
    "new": "New",
    "family": "Family",
    "switch": "Switch",
    "light": "Light",
    "cover": "Cover",
    "lock": "Lock",
    "disconnected":"disconnected",
    "dconnected":"connected",
    "normal": "Generic",
    "choose":"select",
    "push": "Push",
    "dual-push": "Dual Push",
    "dual-normal": "Dual Generic",
    "mode": "Mode",
    "relay-mqtt": "Relay / MQTT",
    "control": "Output",
    "pin-in-a": "Input Pin a",
    "pin-in-b": "Input Pin b",
    "pin-out-1": "Output Pin 1",
    "pin-out-2": "Output Pin 2",
    "none": "None",
    "retain-message": "Retain Messages",
    "command": "Command",
    "state": "State",
    "on": "On",
    "off": "Off",
    "lock": "Lock",
    "unlock": "Unlocked",
    "open": "Open",
    "close": "Closed",
    "stop": "Stop",
    "time": "Time"

};
var WORDS_PT = {
    "node": "NÓ",
    "update": "ATUALIZAR",
    "features": "FUNÇÕES",
    "current-version": "Versão atual",
    "new-file": "Escolher o ficheiro da nova versão",
    "install-new-version": "Instalar nova versão",
    "version": "Versão",
    "save": "Guardar",
    "choose":"escolher",
    "clean-fields": "Limpar todos os campos",
    "username": "Utilizador",
    "password": "Palavra Passe",
    "yes": "Sim",
    "no": "Não",
    "disconnected":"desligado",
    "dconnected":"ligado",
    "netmask": "Mascara de Rede",
    "system": "Sistema",
    "name": "Nome",
    "in":"em",
    "seconds":"segundos",
    "restart": "Reiniciar",
    "reset-factory": "Carregar Configuração de Fábrica",
    "switches": "Interruptores",
    "remove": "Remover",
    "new": "Criar Novo",
    "family": "Familia",
    "switch": "Interruptor",
    "light": "Luz",
    "cover": "Estore",
    "lock": "Fechadura",
    "normal": "Normal",
    "push": "Pressão",
    "dual-push": "Duplo Normal",
    "dual-normal": "Duplo Pressão",
    "mode": "Mode",
    "relay-mqtt": "Relé / MQTT",
    "control": "Saída",
    "pin-in-a": "Pino Entrada a",
    "pin-in-b": "Pino Entrada b",
    "pin-out-1": "Pino Saída 1",
    "pin-out-2": "Pino Saída 2",
    "none": "Não atribuido",
    "retain-message": "Reter Mensagens",
    "command": "Comando",
    "state": "Estado",
    "on": "Ligado",
    "off": "Desligado",
    "lock": "Trancado",
    "unlock": "Destrancado",
    "open": "Aberto",
    "close": "Fechado",
    "stop": "Parar",
    "time": "Tempo"
};

function loadsLanguage(lang) {
    localStorage.setItem('lang', lang);
    $('span[class^="lang"]').each(function () {
        var langVar = (this.className).replace('lang-', '');
        var text = window["WORDS_" + lang][langVar];
        $(this).text(text);
    });
    $('option[class^="lang"]').each(function () {
        var langVar = (this.className).replace('lang-', '');
        var text = window["WORDS_" + lang][langVar];
        $(this).text(text);
    });
}

function showMessage(pt, en) {
    localStorage.getItem('lang').toString() === "PT" ? alert(pt) : alert(en);
}
function showText(pt, en) {
  return  localStorage.getItem('lang').toString() === "PT" ? pt : en;
}
function loadConfig() {
    const targetUrl = endpoint.baseUrl + "/config";
    $.ajax({
        url: targetUrl,
        contentType: "text/plain; charset=utf-8",
        dataType: "json",
        success: function (response) {
            config = response;
            fillConfig();
        },
        error: function () {
            showMessage("Erro a carregar configuração", "Configuration load failed.")
        }, complete: function () {

        },
        timeout: 2000
    });
}

function loadDevice(func, e, next) {
    const targetUrl = endpoint.baseUrl + "/" + e;
    $.ajax({
        url: targetUrl,
        contentType: "text/plain; charset=utf-8",
        dataType: "json",
        success: function (response) {
            func(response);
            if (next) {
                next();
            }
        },
        error: function () {
            showMessage("Erro a carregar configuração de funcionalidades.", "Features Configuration load failed.")
        },
        timeout: 2000
    });
}

function fillConfig() {
    if (!config) return;
    $("#firmwareVersion").text(config.firmware);
    $(".bh-model").text(config.hardware);
    $(".bh-onofre-item").removeClass("hide");
    $("#version_lbl").text(config.firmware);
    $("#lbl-chip").text(config.chipId);
    $("#lbl-mac").text(config.mac);
    $('input[name="nodeId"]').val(config.nodeId);
    $('input[name="mqttIpDns"]').val(config.mqttIpDns);
    $('#mqtt_lbl').text(config.mqttIpDns);
    $('input[name="mqttUsername"]').val(config.mqttUsername);
    $('select[name="homeAssistantAutoDiscovery"] option[value="' + config.homeAssistantAutoDiscovery + '"]').attr("selected", "selected");
    $('input[name="homeAssistantAutoDiscoveryPrefix"]').val(config.homeAssistantAutoDiscoveryPrefix);
    $('input[name="mqttPassword"]').val(config.mqttPassword);
    $('input[name="wifiSSID"]').val(config.wifiSSID);
    $('input[name="wifiSecret"]').val(config.wifiSecret);
    let staticIp = document.getElementById("staticIp");
    if (staticIp) {
        staticIp.checked = !config.staticIp;
    }
    $('input[name="wifiIp"]').val(config.wifiIp);
    $('input[name="wifiMask"]').val(config.wifiMask);
    $('input[name="wifiGw"]').val(config.wifiGw);
    $('input[name="apSecret"]').val(config.apSecret);
    $('select[name="notificationInterval"] option[value="' + config.notificationInterval + '"]').attr("selected", "selected");
    $('select[name="directionCurrentDetection"] option[value="' + config.directionCurrentDetection + '"]').attr("selected", "selected");
    $('#ff').prop('disabled', false);
}

function toggleActive(menu) {
    $('.sidebar-menu').find('li').removeClass('active');
    $('.menu-item[data-menu="' + menu + '"]').closest('li').addClass('active');
    $(".content").load(menu + ".html", function () {
        if (menu === "devices") {
            switches = [];
            loadDevice(fillSwitches, "switches", function () {
                // loadDevice(fillSensors, "sensors", function () {
                // });

            });
        } else {
            systemStatus();
            fillConfig();
        }
        loadsLanguage(localStorage.getItem('lang'));
    });
}

function fillSwitches(payload) {
    switches = payload;
    if (!payload) return;
    $('#switch_config').empty();
    for (let obj of payload.sort(sortByProperty('name'))) {
        buildSwitch(obj);
    }
}

function applySwitchFamily(id) {
    hide("mqttPositionCommandTopicRow_" + id);
    hide("mqttPositionStateTopicRow_" + id);
    hide("timeBetweenStatesRow_"+id);
    hide("secondaryGpioControlRow_" + id);
    hide("secondaryGpioRow_" + id);
    hide("btn_on_"+id);
    hide("btn_close_"+id);
    hide("btn_stop_"+id);
    hide("btn_open_"+id);
    removeFromSelect('mode_' + id, 4);
    removeFromSelect('mode_' + id, 5);
    removeFromSelect('autoStateValue_' + id, "OPEN");
    removeFromSelect('autoStateValue_' + id,  "CLOSE");
    removeFromSelect('autoStateValue_' + id,  "STOP");
    removeFromSelect('autoStateValue_' + id, "ON");
    removeFromSelect('autoStateValue_' + id, "OFF");
    removeFromSelect('autoStateValue_' + id, "UNLOCK");
    removeFromSelect('autoStateValue_' + id, "LOCK");
    if ($('#family_' + id).val() == "cover") {
        show("btn_close_"+id);
        show("btn_stop_"+id);
        show("btn_open_"+id);
        addToSelect('mode_' + id, "lang-dual-normal", 4);
        addToSelect('mode_' + id, "lang-dual-push", 5);
        addToSelect('autoStateValue_' + id, "lang-open", "OPEN");
        addToSelect('autoStateValue_' + id, "lang-close", "CLOSE");
        addToSelect('autoStateValue_' + id, "lang-stop", "STOP");
        show("mqttPositionCommandTopicRow_" + id);
        show("timeBetweenStatesRow_"+id);
        show("mqttPositionStateTopicRow_" + id);
        show("secondaryGpioControlRow_" + id);
        show("secondaryGpioRow_" + id);
        setOptionOnSelect('mode_' + id, 4);
    } else if ($('#family_' + id).val() == "lock") {
        removeFromSelect('mode_' + id, 1);
        setOptionOnSelect('mode_' + id, 2);
        addToSelect('autoStateValue_' + id, "lang-lock", "LOCK");
        addToSelect('autoStateValue_' + id, "lang-unlock", "UNLOCK");

        show("btn_on_"+id);
    } else {
        addToSelect('mode_' + id, "lang-normal", 1);
        addToSelect('autoStateValue_' + id, "lang-on", "ON");
        addToSelect('autoStateValue_' + id, "lang-off", "OFF");
        setOptionOnSelect('mode_' + id, 1);
        show("btn_on_"+id);
    }
    applyTypeControl(id);
    loadsLanguage(localStorage.getItem('lang'));
}

function applySwitchMode(id) {
    if ($('#family_' + id).val() == "cover") {
        if (($('#mode_' + id).val() == 2)) {
            setOptionOnSelect('secondaryGpioRow_' + id, 99);
            hide("secondaryGpioRow_" + id)
        }
        show("secondaryGpioControlRow_" + id)
    }

    loadsLanguage(localStorage.getItem('lang'));
}
function ifdef(value,defaultValue) {
    if(value) return value;
    return defaultValue;
}
function applyTypeControl(id) {
    if ($('#typeControl_' + id).val() == 1) {
        show("primaryGpioControlRow_" + id);

    } else {
        setOptionOnSelect('primaryGpioControl_' + id, 99);
        setOptionOnSelect('secondaryGpioControl_' + id, 99);
        hide("secondaryGpioControlRow_" + id);
        hide("primaryGpioControlRow_" + id);
    }
    applySwitchMode(id);
}

function buildSwitch(obj) {
    let on = obj.stateControl === 'ON' ? " " + obj.stateControl + " " : "OFF";
    let open = obj.stateControl === 'OPEN' ? " " + obj.stateControl + " " : "";
    let close = obj.stateControl === 'CLOSE' ? " " + obj.stateControl + " " : "";
    let checkedMqttRetain = obj.mqttRetain ? "checked" : "";
    $('#switch_config').append('<div id="bs_' + obj.id + '" style="padding: 0; margin: 10px;" class="col-lg-4 col-md-6 col-xs-12">\n' +
        '                <div style="margin-bottom: 0" class="info-box bg-aqua">\n' +
        '                    <div class="info-box-content"><span class="info-box-text">' + obj.name + '</span>\n' +
        '                        <div class="pull-right">\n' +
        '                            <button onclick="stateSwitch(\'' + obj.id + '\',\'OPEN\')" id="btn_open_' + obj.id + '" class="' + open  + ' btn btn-primary btn-control">\n' +
        '                                <svg width="24" height="24" viewBox="0 0 24 24">\n' +
        '                                    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>\n' +
        '                                    <path d="M0 0h24v24H0z" fill="none"/>\n' +
        '                                </svg>\n' +
        '                            </button>\n' +
        '                            <button onclick="stateSwitch(\'' + obj.id + '\',\'STOP\')" id="btn_stop_' + obj.id + '" class="'  + ' btn btn-primary btn-control">\n' +
        '                                <svg width="24" height="24" viewBox="0 0 24 24">\n' +
        '                                    <path d="M0 0h24v24H0z" fill="none"/>\n' +
        '                                    <path d="M6 6h12v12H6z"/>\n' +
        '                                </svg>\n' +
        '                            </button>\n' +
        '                            <button onclick="stateSwitch(\'' + obj.id + '\',\'CLOSE\')" id="btn_close_' + obj.id + '" class="' + close  + ' btn btn-primary btn-control">\n' +

        '                                <svg width="24" height="24" viewBox="0 0 24 24">\n' +
        '                                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>\n' +
        '                                    <path d="M0 0h24v24H0z" fill="none"/>\n' +
        '                                </svg>\n' +
        '                            </button>\n' +
        '                            <button onclick="stateSwitch(\'' + obj.id + '\',\'' + obj.stateControl + '\')" id="btn_on_' + obj.id + '" class="' + on  + ' btn btn-primary btn-control">\n' +
        '                                <svg style="width:24px;height:24px" viewBox="0 0 24 24">\n' +
        '                                    <path fill="#000000" d="M11,3H13V21H11V3Z"/>\n' +
        '                                </svg>\n' +
        '                            </button>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div style="font-size: 10px;  border: 0 solid #08c; border-radius: 0" class="box">\n' +
        '                    <div class="box-body no-padding">\n' +
        '                        <table class="table table-condensed">\n' +
        '                            <tbody>\n' +
        '                            <tr>\n' +
        '                                <td><span class="label-device"><span\n' +
        '                                    class="lang-name">NOME</span></span></td>\n' +
        '                                <td class="col-xs-8"><input class="input-device form-control" value="' + obj.name + '"\n' +
        '                                                            type="text" id="name_' + obj.id + '" placeholder="ex: luz sala"\n' +
        '                                                            maxlength="30" required/>\n' +
        '                                </td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td><span class="label-device "><span\n' +
        '                                    class="lang-family">FAMILIA</span></span></td>\n' +
        '                                <td><select onchange="applySwitchFamily(\'' + obj.id + '\');" class="form-control select-device" id="family_' + obj.id + '">\n' +
        '                                    <option class="lang-switch" value="switch">Interruptor</option>\n' +
        '                                    <option class="lang-light" value="light">Luz</option>\n' +
        '                                    <option class="lang-cover" value="cover">Estore</option>\n' +
        '                                    <option class="lang-lock" value="lock">Fechadura</option>\n' +
        '                                </select></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td><span class="label-device "><span\n' +
        '                                    class="lang-mode">MODO</span></span></td>\n' +
        '                                <td><select onchange="applySwitchMode(\'' + obj.id + '\');" class="form-control select-device" id="mode_' + obj.id + '">\n' +
        '                                    <option class="lang-normal" value="1">Normal</option>\n' +
        '                                    <option class="lang-push" value="2">Pressão</option>\n' +
        '                                    <option class="lang-dual-normal" value="4">Duplo Normal</option>\n' +
        '                                    <option class="lang-dual-push" value="5">Duplo Pressão</option>\n' +
        '                                </select></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td><span class="label-device "><span\n' +
        '                                    class="lang-control">Controla</span></span></td>\n' +
        '                                <td><select onchange="applyTypeControl(\'' + obj.id + '\');" class="form-control select-device" id="typeControl_' + obj.id + '">\n' +
        '                                    <option class="lang-relay-mqtt" value="1">Relé / MQTT</option>\n' +
        '                                    <option class="lang-mqtt" value="2">MQTT</option>\n' +
        '                                </select></td>\n' +
        '                            </tr>\n' +
        '                            <tr style="  border-top: 1px solid #88bf9c;">\n' +
        '                                <td><span class="label-device "><span\n' +
        '                                    class="lang-pin-in-a">Pinos Entrada A</span></span></td>\n' +
        '                                <td><select class="form-control select-device" id="primaryGpio_' + obj.id + '">\n' +
        '                                    <option class="lang-none" value="99">Nenhum</option>\n' +
        '                                    <option value="4">4 <-> GND</option>\n' +
        '                                    <option value="5">5 <-> GND</option>\n' +
        '                                    <option value="12">12 <-> GND</option>\n' +
        '                                    <option value="13">13 <-> GND</option>\n' +
        '                                    <option value="14">14 <-> GND</option>\n' +
        '                                    <option value="16">16 <-> 3V3</option>\n' +
        '                                </select></td>\n' +
        '                                </select></td>\n' +
        '                            </tr>\n' +
        '                            <tr id="secondaryGpioRow_' + obj.id + '"">\n' +
        '                                <td><span class="label-device"><span\n' +
        '                                    class="lang-pin-in-b">Pinos Entrada B</span></span></td>\n' +
        '                                <td><select class="form-control select-device" id="secondaryGpio_' + obj.id + '">\n' +
        '                                    <option class="lang-none" value="99">Nenhum</option>\n' +
        '                                    <option value="4">4 <-> GND</option>\n' +
        '                                    <option value="5">5 <-> GND</option>\n' +
        '                                    <option value="12">12 <-> GND</option>\n' +
        '                                    <option value="13">13 <-> GND</option>\n' +
        '                                    <option value="14">14 <-> GND</option>\n' +
        '                                    <option value="16">16 <-> 3V3</option>\n' +
        '                                </select></td>\n' +
        '                            </tr>\n' +
        '                            <tr id="primaryGpioControlRow_' + obj.id + '" style="  border-top: 1px solid #d9534f;">\n' +
        '                                <td><span class="label-device "><span\n' +
        '                                    class="lang-pin-out-1">Pinos Saida 1</span></span></td>\n' +
        '                                <td><select class="form-control select-device" id="primaryGpioControl_' + obj.id + '">\n' +
        '                                    <option class="lang-none" value="99">Nenhum</option>\n' +
        '                                    <option value="4">4 <-> GND</option>\n' +
        '                                    <option value="5">5 <-> GND</option>\n' +
        '                                    <option value="12">12 <-> GND</option>\n' +
        '                                    <option value="13">13 <-> GND</option>\n' +
        '                                    <option value="14">14 <-> GND</option>\n' +
        '                                    <option value="16">16 <-> 3V3</option>\n' +
        '                                </select></td>\n' +
        '                            </tr>\n' +
        '                            <tr id="secondaryGpioControlRow_' + obj.id + '" ">\n' +
        '                                <td><span class="label-device "><span\n' +
        '                                    class="lang-pin-out-2">Pinos Saida 2</span></span></td>\n' +
        '                                <td><select class="form-control select-device" id="secondaryGpioControl_' + obj.id + '">\n' +
        '                                    <option class="lang-none" value="99">Nenhum</option>\n' +
        '                                    <option value="4">4 <-> GND</option>\n' +
        '                                    <option value="5">5 <-> GND</option>\n' +
        '                                    <option value="12">12 <-> GND</option>\n' +
        '                                    <option value="13">13 <-> GND</option>\n' +
        '                                    <option value="14">14 <-> GND</option>\n' +
        '                                    <option value="16">16 <-> 3V3</option>\n' +
        '                                </select></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td><span class="label-device" style="color: #88bf9c; font-size: 13px;">MQTT</span></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td><span class="label-device-indent"><span class="lang-command">Comando</span></span></td>\n' +
        '                                <td> <span style="word-break: break-word" >' + obj.mqttCommandTopic + '</span></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td><span class="label-device-indent"><span class="lang-state">Estado</span></span></td>\n' +
        '                                <td><span  style="word-break: break-word">' + obj.mqttStateTopic + '</span></td>\n' +
        '                            </tr>\n' +
        '                            <tr id="mqttPositionCommandTopicRow_' + obj.id + '" ">\n' +
        '                                <td><span class="label-device-indent"><span class="lang-command">Comando</span></span></td>\n' +
        '                                <td><span  style="word-break: break-word" >' + ifdef(obj.mqttPositionCommandTopic,"../setposition") + '</span></td>\n' +
        '                            </tr>\n' +
        '                            <tr id="mqttPositionStateTopicRow_' + obj.id + '" ">\n' +
        '                                <td><span class="label-device-indent"><span class="lang-state">Estado</span></span></td>\n' +
        '                                <td><span  style="word-break: break-word" >' + ifdef(obj.mqttPositionStateTopic,"../position") + '</span></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td style="vertical-align: middle"><span class="label-device-indent label-device"><span class="lang-retain-message">Reter Mensagens</span></span></td>\n' +
        '                                <td><input class="form-control" style="width: 20px; height: 20px;" ' + checkedMqttRetain + ' type="checkbox" id="mqttRetain_' + obj.id + '" value="' + obj.mqttRetain + '"></td>\n' +
        '                            </tr>\n' +
        '                            <tr id="timeBetweenStatesRow_'+obj.id+'" >\n' +
        '                                <td><span class="label-device"><span\n' +
        '                                    class="lang-time">TEMPO</span></span></td>\n' +
        '                                <td class="col-xs-8"><input class="input-device form-control" value="' + obj.timeBetweenStates / 1000 + '"\n' +
        '                                                            type="text" id="timeBetweenStates_' + obj.id + '" placeholder="ex: 12"\n' +
        '                                                             maxlength="2" required/>\n' +
        '                                </td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td><span class="label-device"><span\n' +
        '                                    class="lang-auto-state">Estádo automático</span></span></td>\n' +
        '                                <td class="col-xs-8"><span style="float: left" class="lang-in">em</span><input style="width: 50px; float: left; margin-left: 5px;" class="input-device form-control" value="' + (obj.autoStateDelay / 1000) + '"\n' +
        '                                                            type="text" id="autoStateDelay_' + obj.id + '" placeholder="ex: 12"\n' +
        '                                                             maxlength="2" required/><span style="float: left; margin-left: 5px;" class="lang-seconds">segundos</span> \n' +
        '                                <select class="form-control select-device" style="float: left; width: 150px; margin-left: 5px;" id="autoStateValue_' + obj.id + '">\n' +
        '                                    <option class="lang-choose" value="">Escolha</option>\n' +
        '                                    <option class="lang-on" value="ON">ON</option>\n' +
        '                                    <option class="lang-off" value="OFF">OFF</option>\n' +
        '                                    <option class="lang-stop" value="STOP">STOP</option>\n' +
        '                                    <option class="lang-close" value="CLOSE">CLOSE</option>\n' +
        '                                    <option class="lang-open" value="OPEN">OPEN</option>\n' +
        '                                    <option class="lang-lock" value="LOCK">CLOSE</option>\n' +
        '                                    <option class="lang-unlock" value="UNLOCK"UNLOCK</option>\n' +
        '                                </select>\n' +
        '                                </td>\n' +
        '                            </tr>\n' +

        '                            </tbody>\n' +
        '                        </table>\n' +
        '                        <div class="box-footer save">\n' +
        '                            <button onclick="removeDevice(\'remove-switch\',\'' + obj.id + '\',fillSwitches)" style="font-size: 12px" class="btn btn-danger"><span\n' +
        '                                class="lang-remove">Remover</span></button>\n' +
        '                            <button  onclick="saveSwitch(\'' + obj.id + '\')" style="font-size: 12px" class="btn btn-primary"><span\n' +
        '                                class="lang-save">Guardar</span></button>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>');

    if (obj.family == "cover") {
        removeFromSelect('mode_' + obj.id, 1);
    } else {
        removeFromSelect('mode_' + obj.id, 4);
        removeFromSelect('mode_' + obj.id, 5);
    }
    setOptionOnSelect('family_' + obj.id, obj.family);
    applySwitchFamily(obj.id);
    setOptionOnSelect('typeControl_' + obj.id, obj.typeControl);
    setOptionOnSelect('mode_' + obj.id, obj.mode);
    applyTypeControl(obj.id);
    setOptionOnSelect('primaryGpioControl_' + obj.id, obj.primaryGpioControl);
    setOptionOnSelect('secondaryGpioControl_' + obj.id, obj.secondaryGpioControl);
    setOptionOnSelect('primaryGpio_' + obj.id, obj.primaryGpio);
    setOptionOnSelect('secondaryGpio_' + obj.id, obj.secondaryGpio);
    setOptionOnSelect('autoStateValue_' + obj.id, obj.autoStateValue);

    loadsLanguage(localStorage.getItem('lang'));
}

function stateSwitch(id, state) {
    let toggleState = state;
    if ((toggleState ==="ON" || toggleState==="OFF") && ($("#btn_on_" + id).hasClass("ON") || $("#btn_on_" + id).hasClass("OFF"))) {
        toggleState = $("#btn_on_" + id).hasClass("ON") ? "OFF" : "ON";
    }
    const targetUrl = endpoint.baseUrl + "/state-switch?state=" + toggleState + "&id=" + id;
    $.ajax({
        type: "GET",
        url: targetUrl,
        contentType: "text/plain; charset=utf-8",
        dataType: "json",
        success: function (response) {

        },
        error: function () {

        }, complete: function () {

        },
        timeout: 2000
    });
}

function saveSwitch(id) {
    let device = {
        "id": id,
        "name": $('#name_' + id).val(),
        "family": $('#family_' + id).val(),
        "primaryGpio": parseInt($('#primaryGpio_' + id).val()),
        "secondaryGpio": parseInt($('#secondaryGpio_' + id).val()),
        "timeBetweenStates": parseInt($('#timeBetweenStates_' + id).val()) * 1000,
        "autoStateValue":  $('#autoStateValue_' + id).val(),
        "autoStateDelay": parseInt($('#autoStateDelay_' + id).val())*1000,
        "typeControl": parseInt($('#typeControl_' + id).val()),
        "mode": parseInt($('#mode_' + id).val()),
        "pullup": true,
        "mqttRetain": document.getElementById('mqttRetain_' + id).checked,
        "inverted": false,
        "primaryGpioControl": parseInt($('#primaryGpioControl_' + id).val()),
        "secondaryGpioControl": parseInt($('#secondaryGpioControl_' + id).val()),
    };
    storeDevice(device, "save-switch");
}

$(document).ready(function () {
    let lang = localStorage.getItem('lang');
    if (lang) {
        loadsLanguage(lang);
    } else {
        window.navigator.language.startsWith("en") ? loadsLanguage("EN") : loadsLanguage("PT");
    }
    loadConfig();
    $('#node_id').on('keypress', function (e) {
        if (e.which === 32)
            return false;
    });
    $('.menu-item').click(function (e) {
        let menu = $(e.currentTarget).data('menu');
        toggleActive(menu);

    });
    systemStatus();
    toggleActive("node");
    setInterval(systemStatus, 15000);
    if (!!window.EventSource) {
        let source = new EventSource(endpoint.baseUrl + '/events');
        source.addEventListener('states', function (e) {
            let json = JSON.parse(e.data);
            let state = json.state == "OFF" ? "on" : json.state.toLowerCase();
            $("#btn_" + state + "_" + json.id).removeClass("ON");
            $("#btn_" + state + "_" + json.id).removeClass("OPEN");
            $("#btn_" + state + "_" + json.id).removeClass("CLOSE");
            $("#btn_" + state + "_" + json.id).addClass(json.state);
        }, false);

    }

});

function storeConfig() {
    const targetUrl = endpoint.baseUrl + "/save-config";
    $.ajax({
        type: "POST",
        url: targetUrl,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(config),
        success: function (response) {
            config = response;
            fillConfig();
            showMessage("Configuração Guardada", "Config Stored")
        },
        error: function () {
            showMessage("Não foi possivel guardar a configuração atual, por favor tenta novamente.", "Unable to save current configuration, please try again.")
        },
        timeout: 2000
    });
}

function saveNode() {
    config.nodeId = $('#nodeId').val().trim();
    storeConfig();
}

function saveWifi() {
    config.wifiSSID = $('#ssid').val().trim();
    config.wifiSecret = $('#wifi_secret').val().trim();
    config.wifiIp = $('#wifiIp').val().trim();
    config.wifiMask = $('#wifiMask').val().trim();
    config.wifiGw = $('#wifiGw').val().trim();
    config.staticIp = !document.getElementById("staticIp").checked;
    config.apSecret = $('#apSecret').val().trim();
    storeConfig();
}

function saveMqtt() {
    config.mqttIpDns = $('#mqtt_ip').val().trim();
    config.mqttUsername = $('#mqtt_username').val().trim();
    config.mqttPassword = $('#mqtt_password').val().trim();
    storeConfig();
}

function removeDevice(e, id, func) {

    const targetUrl = endpoint.baseUrl + "/" + e + "?id=" + id;
    $.ajax({
        url: targetUrl,
        contentType: "text/plain; charset=utf-8",
        dataType: "json",
        success: function (response) {
            switches.splice(switches.findIndex(function (item, i) {
                return item.id === id
            }), 1);
            fillSwitches(switches);
        },
        error: function () {
            showMessage("Não foi possivel remvover a funcionalidade, por favor tenta novamente", "Unable to remove this feature, please try again.")
        },
        timeout: 2000
    });
}

function storeDevice(device, endpointstore) {

    const targetUrl = endpoint.baseUrl + "/" + endpointstore + "?id=" + device.id;
    $.ajax({
        type: "POST",
        url: targetUrl,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(device),
        success: function (response) {
            let idx = switches.findIndex(function (item, i) {
                return item.id === device.id
            });
            if(idx >= 0) {
                switches.splice(idx, 1);
            }
            if (endpointstore === "save-switch") {
                switches.push(response);
                fillSwitches(switches);
            }
            showMessage("Configuração Guardada", "Config Stored")

        },
        error: function () {
            showMessage("Não foi possivel guardar a configuração atual, por favor tenta novamente.", "Unable to save current configuration, please try again.")
        }, complete: function () {

        },
        timeout: 2000
    });
}

function reboot() {
    $.ajax({
        url: endpoint.baseUrl + "/reboot",
        contentType: "text/plain; charset=utf-8",
        dataType: "json",
        success: function (response) {
            showMessage("O dispositivo está a reiniciar, ficará disponivel dentro de 10 segundos.", "The device is restartin, will be available in 10 seconds.")
        }, error: function () {
            showMessage("Não foi possivel reiniciar o dispositivo, verifica se está correctamente ligado à rede. Se o problema persistir tenta desligar da energia e voltar a ligar.", "Unable to restart the device, check if it is connected to the correct network. If the problem persists try turning the power off.")
        },
        timeout: 2000
    });
}

function loadDefaults() {
    $.ajax({
        url: endpoint.baseUrl + "/load-defaults",
        contentType: "text/plain; charset=utf-8",
        dataType: "json",
        success: function (response) {
            showMessage("Configuração de fábrica aplicada com sucesso. Por favor volte a ligar-se ao Access Point e aceda ao painel de controlo pelo endereço http://192.168.4.1 no seu browser.", "Configuração de fábrica aplicada com sucesso. Por favor volte a ligar-se ao Access Point e aceda ao painel de controlo pelo endereço http://192.168.4.1 no seu browser.")
        }, error: function () {
            showMessage("Não foi possivel carregar a configuração de fábrica no dispositivo, verifica se está correctamente ligado à rede. Se o problema persistir tenta desligar da energia e voltar a ligar.", "Unable to load factory configuration on the device, check if it is connected to the correct network. If the problem persists try turning the power off.")
        },
        timeout: 1000
    });
}

function systemStatus() {
    $.ajax({
        url: endpoint.baseUrl + "/system-status",
        contentType: "text/plain; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $('#ssid_lbl').text(response.wifiSSID);
            if (document.getElementById("wifiIp") && ($('input[name="wifiIp"]').val().trim().length === 0 ||  $('input[name="wifiIp"]').val() === "(IP unset)")) {
                $('input[name="wifiIp"]').val(response.wifiIp);
                $('input[name="wifiMask"]').val(response.wifiMask);
                $('input[name="wifiGw"]').val(response.wifiGw);
            }
            let percentage = Math.min(2 * (parseInt(response.signal) + 100), 100);
            if(config) {
                $('#mqtt_lbl').text(config.mqttIpDns);
            }
            if (response.mqttConnected) {
                $('#mqtt-state').text(showText("ligado", "connected"));
            } else {
                $('#mqtt-state').text(showText("desligado", "disconnected"));
            }
            $('#lbl-heap').text(response.freeHeap);
            $('#wifi-signal').text(percentage + "%");
        }, error: function () {
            $('#wifi-signal').text("0%");
        },
        timeout: 1000
    });
}

function buildSwitchTemplate() {
    if ($('#bs_NEW').length > 0) return
    let device = {
        "id": "NEW",
        "name": "Novo Interruptor",
        "family": "switch",
        "primaryGpio": 99,
        "secondaryGpio": 99,
        "timeBetweenStates": 0,
        "autoStateDelay": 0,
        "autoStateValue": "",
        "typeControl": 2,
        "mode": 1,
        "pullup": false,
        "mqttRetain": false,
        "inverted": false,
        "mqttCommandTopic": "../set",
        "mqttStateTopic": "../state",
        "mqttPositionCommandTopic": "../setposition",
        "mqttPositionStateTopic": "../position",
        "primaryGpioControl": 99,
        "secondaryGpioControl": 99,
    };
    buildSwitch(device);
}