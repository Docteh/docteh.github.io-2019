'use strict';

// idea here is to abstract around the use of chrome.storage.local as it functions differently from "localStorage" and IndexedDB
var configAbstraction = {
    // key can be one string, or array of strings
    get: function(key, callback) {
        if (chrome.storage) {
            chrome.storage.get(key,callback);
        } else {
            console.log('Abstraction.get',key);
            if(key.forEach) {
                console.log(key);
                var obj = {};
                key.forEach(function (element) {
                    try {
obj = {...obj, ...JSON.parse(window.localStorage.getItem(element))};
                    } catch (e) {
                        // is okay
                    }
                });
            } else {
                var keyValue = window.localStorage.getItem(key);
                if (keyValue) {
                    var obj = {};
                    console.log('returning',key,keyValue);
                    try {
                        obj = JSON.parse(keyValue);
                    } catch (e) {
                        // It's fine if we fail that parse
                    }
                    callback(obj);
                } else {
                    callback({});
                }
            }
        }
    },
    // set takes an object like {'userLanguageSelect':'DEFAULT'}
    set: function(input) {
        if (chrome.storage) {
            chrome.storage.set(input);
        } else {
            console.log('Abstraction.set',input);
            Object.keys(input).forEach(function (element) {
                window.localStorage.setItem(element, JSON.stringify(input));
            });
        }
    }
}