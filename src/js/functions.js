function el (tagName, attributes, children) {
    var element = document.createElement(tagName);
    if (typeof attributes === 'object') {
        Object.keys(attributes).forEach( function (i) {
            element.setAttribute(i, attributes[i]);
        });
    }
    if (typeof children === 'string') {
        element.textContent = children;
    } else if (children instanceof Array) {
        children.forEach( function (child) {
            element.appendChild(child);
        });
    }
    return element;
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function isLocalStorageNameSupported() {
	var testKey = 'test';
	try {
		localStorage.setItem(testKey, '1');
		localStorage.removeItem(testKey);
		return true;
    } 
    catch (error) {
		return false;
	}
}
function localSetItem(name, value) {
	if (isLocalStorageNameSupported()) {
		localStorage.setItem(name, value);
		return true;
	}
	return false;
}
function localGetItem(name, defaultValue) {
	if (!defaultValue) {
		defaultValue = false;
	}
	if (isLocalStorageNameSupported()) {
		return localStorage.getItem(name);
	}
	return defaultValue;
}

function clearNode(node) {
    if (!node) {
        return false;
    }
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function getParentByClassname(object, className) {
    if (!object) {
        return false;
    }
    var currentLevel = object;
    while (currentLevel.parentNode) {
        try {
            if (currentLevel.parentNode.classList.contains(className)) {
                return currentLevel.parentNode;
            }
            currentLevel = currentLevel.parentNode;
        } catch (error) {
            return false;
        }
    }
    return false;
}

function showBlock(node) {
    if (!node) {
        return false;
    }
    if (isHidden(node)) {
        node.style.display = "block";
    } else {
        node.style.display = "none";
    }
}

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none');
}

function sendData(url, data, func) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function (e) {
        if (func) {
            func(xhr.response);
        }
    });
    xhr.addEventListener('error', function (e) {
        console.log("Ошибка " + e.target.status);
    });
    var method = "POST";
    if (!data) {
        method = "GET";
    }
    xhr.open(method, url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    if (method == 'POST') {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        //xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        
        if (typeof data == 'object') {
            data = stringifyObject(data);
        }
    }
    xhr.send(data);
}

function stringifyObject(obj, prefix) {
    
    var str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
            v = obj[p];
        str.push((v !== null && typeof v === "object") ?
            stringifyObject(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
    /*return Array.from(Object.keys(obj)).reduce(
        function (prev, cur, idx) {
            return idx == 1 ? prev + '=' + obj[prev] + '&' + cur+ '=' + obj[cur] : prev + '&' + cur + '=' + obj[cur];
        }
    );*/
}

function jsonParse(string) {
    try {
        return JSON.parse(string);
    }
    catch (err) {
        return false;
    }
}

function findInObjects(array, name, value) {
    var searchIndex = -1;

    if (!array) {
        return searchIndex;
    }

    Array.from(array).forEach( function (element, index) {
        if (element.hasOwnProperty(name) && element[name] === value) {
            searchIndex = index;
        }
    });

    return searchIndex;
}