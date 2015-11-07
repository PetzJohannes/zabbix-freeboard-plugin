# Information
A plugin for the freeboard software from [Freeboard/freeboard](https://github.com/Freeboard/freeboard).

## Features
- Create Zabbix API JSONs
- Add filter
- Add search conditions
- Count the return values
- Get back html code and format as table

# Requirements
This plugin requires the jqzabbix.js and jquery-2.1.1.min.js from [kodai/jqzabbix](https://github.com/kodai/jqzabbix) in the js folder.

# How to
1. Include the jquery code from jqzabbix to the index.html
```html
<script type="text/javascript" charset="utf-8" src="js/jquery-2.1.1.min.js"></script>
```
2. Include the Zabbix Plugin
```js
head.js("js/zabbix.js",
    function()
    {
        $(function()
        {
                freeboard.initialize(true);
        });
    }
);
```
3. Open the index.html in your browser
4. Create a new datasource
![ScreenShot](https://raw.github.com/PetzJohannes/zabbix-freeboard-plugin/master/pictures/datasource_config.png)
Informations about functions can be found at [Zabbix API](https://www.zabbix.com/documentation/2.4/manual/api)
5. Create a new widget and handle it with your datasource
6. Enjoy the dashboard

# Functions
| Option | Example |
| ------ | ------- |
| NAME | name for your datasource |
| USERNAME | Zabbix API username |
| PASSWORD | Zabbix API user password |
| ZABBIX API URL | URL of your Zabbix API |
| COUNT | count the returned values |
| OUTPUT | table headers if count = false |
| API METHOD | Zabbix API method for getting values |
| API PARAMETER | Zabbix API parameter for examle: output = extend, only_true = true |
| API FILTER | JSON filter like {..., filter={"triggerid":"1"}} |
| API SEARCH | JSON search like {..., search={"name":"Memory"}} |

If you want the HTML table output, you need the output parameter value "extend" or no output parameter.

# Planned features
- Bootstrap table output
- Widget for colored graphical view for counted items
