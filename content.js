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
                var currRow = mutation.addedNodes[i];
                if( (currRow.cells != null) && (currRow.cells.length > 7) && (currRow.cells[2].innerText!='BTC') ) {
                    var curr = currRow.cells[7].innerText;
                    var quan = currRow.cells[6].innerText;
                    if( (curr.indexOf('$') == -1) && (curr>0) ) {
                        var USDval = (curr * BTCtoUSD);
                        var next = USDval.toLocaleString('en-US', {style:'currency',currency:'USD'});
                        var item = (USDval / quan).toLocaleString('en-US', {style:'currency',currency:'USD'});
                        currRow.cells[7].innerHTML = curr + "<br/><small>" + next + "</small>";
                        currRow.cells[8].innerHTML += "<br/><small><i>" + item + "</i></small>";
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

