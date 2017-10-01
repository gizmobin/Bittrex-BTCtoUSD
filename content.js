var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      callback((xhr.status === 200)?null:xhr.status, xhr.response);
    };
    xhr.send();
};

var observer = new MutationObserver(function(mutations) {
    if( BTCtoUSD != 0 ) {
        mutations.forEach(function(mutation) {
            // console.log('mutation.type = ' + mutation.type);
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if( (mutation.addedNodes[i].cells != null) && (mutation.addedNodes[i].cells.length > 7) ) {
                    var curr = mutation.addedNodes[i].cells[7].innerText;
                    if( (curr.indexOf('$') == -1) && (curr>0) ) {
                        var next = (curr * BTCtoUSD).toLocaleString('en-US', {style:'currency',currency:'USD'});
                        mutation.addedNodes[i].cells[7].innerHTML = curr + "<br/><small>" + next + "</small>";
                        // console.log( curr + " => " + next );
                    }
                }
            }
        });
    }
});

var BTCtoUSD = 0;
function getUSDvalue() {
    getJSON('https://blockchain.info/ticker', function(err, data) {
        if (err !== null) {
            console.log('Error: ' + err);
            BTCtoUSD = 0;
        } 
        else {
            BTCtoUSD = data.USD.last;
            console.log( "BTC value ==> " + BTCtoUSD + " USD" );
        }
    });
}

getUSDvalue();
observer.observe(document.getElementById('balanceTable'), { childList: true, subtree: true, characterData: true });

