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