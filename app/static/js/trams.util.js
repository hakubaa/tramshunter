/* MODEL */
function TramsModel() {
    this.data = [];
    this.callbacks = {
       onLoad: undefined,
       onLoaded: undefined,
       onError: undefined
    };
 } 
     
TramsModel.prototype.on = function(event, callback) {
    this.callbacks[event] = callback;
};
TramsModel.prototype.loadData = function() {
    if (this.callbacks.onLoad !== undefined) {
       this.callbacks.onLoad(self);
    }
    var self = this;
    $.ajax({
        dataType: "json",
        url: "/data",
        data: null,
        cache: false,
        success: function(response) {
            self.data.push({
                  timestamp: new Date(),
                  data: response.result
            });
            if (self.callbacks.onLoaded !== undefined) {
                self.callbacks.onLoaded(response.result);
            }
        },
        error: self.callbacks.onError
    });
};
TramsModel.prototype.getData = function() {
    if (this.data.length > 0) {
        return (this.data[this.data.length-1]);
    } else {
        return (null);
    }
};

/* CONTROLLER */
function TramsControler(model) {
    this.model = model;
    this.filter = [];
    this.colors = {};
    this.callbacks = {
        onLoad: undefined,
        onLoaded: undefined
    };
}

TramsControler.prototype.on = function(event, callback) {
    this.callbacks[event] = callback;
}; 
TramsControler.prototype.addToFilter = function(line) {
    if (this.filter.indexOf(line) < 0) {
        this.filter.push(line)
    }
};
TramsControler.prototype.removeFromFilter = function(line) {
    var index = this.filter.indexOf(line);
    if (index > -1) {
        this.filter.splice(index, 1);
    }
};
TramsControler.prototype.clearFilter = function() {
    this.filter = [];
};
TramsControler.prototype.getTrams = function() {
    var trams = this.model.getData().data;
    if (trams !== null && this.filter.length > 0) {
        var temp = [];
        for (var i = 0; i < trams.length; i++) {
            if (this.filter.indexOf(parseInt(trams[i].FirstLine, 10)) > -1) {
                temp.push(trams[i]);
            }
        }
        trams = temp;
    }
    return trams;
};        
TramsControler.prototype.updateData = function() {
    // update model's callbacks
    var self = this;
    this.model.on("onLoad", function() { 
        if (self.callbacks.onLoad !== undefined) {
            self.callbacks.onLoad(self);
        }
    });
    this.model.on("onLoaded", function(data) {
        if (self.callbacks.onLoaded !== undefined) {
            self.callbacks.onLoaded(self);
        }
    });
    this.model.loadData();
};
TramsControler.prototype.setColor = function(line, color) {
    alert("NEW COLOR");
};
TramsControler.prototype.clearColors = function() {
    alert("Finish this");
};
TramsControler.prototype.saveColorsInStorage = function() {
    alert("Finish it");
};
TramsControler.prototype.loadColorsFromStorage = function() {
    alert("Finish it");
};

/* TIMER FOR DATA UPDATING */   
function Timer(time, interval) {
    this.time = time;
    this.interval = interval;

    this.timer = undefined;
    this.callbacks = {
        onInterval: undefined,
        onStart: undefined,
        onEnd: undefined,
        onStop: undefined
    };
}
Timer.prototype.on = function(event, callback) {
    this.callbacks[event] = callback;
};
Timer.prototype.init = function(time, interval) {
    this.time = time;
    this.interval = interval;
};
Timer.prototype.start = function() {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
        this.timer = undefined;
    }
    var counter = this.time;
    if (this.callbacks.onStart !== undefined) {
        this.callbacks.onStart();
    }
    var self = this;
    this.timer = setInterval(function() {
        if (counter <= 0) {
             clearInterval(self.timer);
             if (self.callbacks.onEnd !== undefined) {
                 self.callbacks.onEnd();
             }
        } else {
            if (self.callbacks.onInterval !== undefined) {
                self.callbacks.onInterval(counter);
            }
            counter--;
        }
    }, this.interval * 1000);
};
Timer.prototype.stop = function() {
    clearInterval(this.timer);
    this.timer = undefined;
    if (this.callbacks.onStop !== undefined) {
        this.callbacks.onStop();
    }
}