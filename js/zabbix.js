(function()
{
    freeboard.loadDatasourcePlugin({
        "type_name"   : "zabbix_datasource",
        "display_name": "Zabbix API datasource",
        "description" : "Get data from Zabbix API via jquery",
        "external_scripts": [
            "js/jqzabbix.js"
        ],
        "settings"    : [
            {
                "name"         : "username",
                "display_name" : "Username",
                "type"         : "text",
                "default_value": "Admin",
                "description"  : "Zabbix username with api permissions."
            },
            {
                "name"         : "password",
                "display_name" : "Password",
                "type"         : "text",
                "default_value": "zabbix",
                "description"  : "Zabbix API user password."
            },
            {
                "name"         : "url",
                "display_name" : "Zabbix API URL",
                "type"         : "text",
                "default_value": "http://localhost/zabbix/api_jsonrpc.php",
                "description"  : "Zabbix API url."
            },
            {
                "name"         : "count",
                "display_name" : "Count",
                "type"         : "boolean",
                "description"  : "Count the return?"
            },
            {
                "name"         : "tableheaders",
                "display_name" : "Output",
                "type"         : "text",
                "default_value": "triggerid, description",
                "description"  : "Columns to show for HTML output field."
            },
            {
                "name"         : "api_method",
                "display_name" : "API Method",
                "type"         : "text",
                "description"  : "Zabbix API Method",
                "default_value": "trigger.get"
            },
            {
                "name"         : "params",
                "display_name" : "API parameter",
                "type"         : "array",
                "description"  : "Zabbix API parameter",
                "settings"    : [
                    {
                        "name"            : "option",
                        "display_name"    : "Option",
                        "type"            : "text"
                    },
                    {
                        "name"        : "value",
                        "display_name": "Value",
                        "type"        : "text"
                    }
                ]
            },
            {
                "name"         : "filter",
                "display_name" : "API filter",
                "type"         : "array",
                "description"  : "Zabbix API filter",
                "settings"    : [
                    {
                        "name"            : "option",
                        "display_name"    : "Option",
                        "type"            : "text"
                    },
                    {
                        "name"        : "value",
                        "display_name": "Value",
                        "type"        : "text"
                    }
                ]
            },
            {
                "name"         : "search",
                "display_name" : "API search",
                "type"         : "array",
                "description"  : "Zabbix API search",
                "settings"    : [
                    {
                        "name"            : "option",
                        "display_name"    : "Option",
                        "type"            : "text"
                    },
                    {
                        "name"        : "value",
                        "display_name": "Value",
                        "type"        : "text"
                    }
                ]
            },
            {
                "name"         : "refresh_time",
                "display_name" : "Refresh Time",
                "type"         : "text",
                "description"  : "In milliseconds",
                "default_value": 5000
            }
        ],

        newInstance   : function(settings, newInstanceCallback, updateCallback)
        {
            newInstanceCallback(new zabbixApiPlugin(settings, updateCallback));
        }
    });

    var zabbixApiPlugin = function(settings, updateCallback)
    {
        var self = this;
        var currentSettings = settings;
        var server = new $.jqzabbix({
                url: currentSettings.url,  // URL of Zabbix API
                username: currentSettings.username,   // Zabbix login user name
                password: currentSettings.password,  // Zabbix login password
                basicauth: false,    // If you use basic authentication, set true for this option
                busername: '',       // User name for basic authentication
                bpassword: '',       // Password for basic authentication
                timeout: 5000,       // Request timeout (milli second)
                limit: 1000,         // Max data number for one request
            });
        var output = null;

        function getData()
        {
            server.getApiVersion();
            server.userLogin();
            var params = {};
            for(var i = 0; i < currentSettings.params.length; i++) {
                params[currentSettings.params[i]["option"]] = currentSettings.params[i]["value"];
            }
            if(currentSettings.filter) {
                var filter = {};
                for(var i = 0; i < currentSettings.filter.length; i++) {
                    filter[currentSettings.filter[i]["option"]] = currentSettings.filter[i]["value"];
                }
                params["filter"] = filter;
            }
            if(currentSettings.search) {
                var search = {};
                for(var i = 0; i < currentSettings.search.length; i++) {
                    search[currentSettings.search[i]["option"]] = currentSettings.search[i]["value"];
                }
                params["search"] = search;
            }
            server.sendAjaxRequest(currentSettings.api_method, params, successMethod, errorMethod);
        }

        var successMethod = function  (response, status)
        {
            if(currentSettings.count) {
                returnval = response.result.length;    
            } else {
                returnval = createHtmlOutput(response);
            }
            updateCallback(returnval);
        }

        var errorMethod = function ()
        {
            console.log("error");
        }

        function createHtmlOutput(response)
        {
            output = currentSettings.tableheaders.split(", ");
            if( output.length != 0) {
                returnval = "<table><tr>";
                for (var i = 0; i < output.length; i++) {
                    returnval = returnval + "<td>" + output[i] + "</td>";
                }
                returnval = returnval + "</tr>";
                for (var i = 0; i < response.result.length; i++) {
                    returnval = returnval + "<tr>"
                    for (var j = 0; j < output.length; j++) {
                    returnval = returnval + "<td>" + response.result[i][output[j]] + "</td>";    
                    }
                    returnval = returnval + "</tr>"
                }
                returnval = returnval + "</tr></table>";
            } else {
                returnval = "Please define an output!";
            }
            return returnval;
        }

        var refreshTimer;

        function createRefreshTimer(interval)
        {
            if(refreshTimer)
            {
                clearInterval(refreshTimer);
            }
            refreshTimer = setInterval(function()
            {
                getData();
            }, interval);
        }

        self.onSettingsChanged = function(newSettings)
        {
            currentSettings = newSettings;
        }

        self.updateNow = function()
        {
            getData();
        }

        self.onDispose = function()
        {
            clearInterval(refreshTimer);
            refreshTimer = undefined;
        }

        createRefreshTimer(currentSettings.refresh_time);
    }
}());
