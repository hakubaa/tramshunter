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
            if (response.status == "OK") {
                self.data.push({
                      timestamp: new Date(),
                      data: response.result
                });
                if (self.callbacks.onLoaded !== undefined) {
                    self.callbacks.onLoaded(response.result);
                }
            } else {
                if (self.callbacks.onError !== undefined) {
                    self.callbacks.onError();
                }
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
    this.colors = [];
    this.callbacks = {
        onLoad: undefined,
        onLoaded: undefined,
        onError: undefined
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
    var trams = this.model.getData();
    if (trams !== null) {
        var data = trams.data;
        // Apply Filter
        if (this.filter.length > 0) {
            var temp = [];
            for (var i = 0; i < data.length; i++) {
                if (this.filter.indexOf(parseInt(data[i].FirstLine, 10)) > -1) {
                    temp.push(data[i]);
                }
            }
            data = temp;
        }
        return data;
    }
    return null;
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
    this.model.on("onError", function(data) {
        if (self.callbacks.onError !== undefined) {
            self.callbacks.onError(self);
        }
    });
    this.model.loadData();
};
TramsControler.prototype.setColor = function(line, color) {
    var index = 0;
    while (index < this.colors.length) {
        if (this.colors[index].line === line) {
            break;
        }
        index++;
    }
    if (index < this.colors.length) {
        this.colors[index].color = color;
    } else {
        this.colors.push({line: line, color: color});
    }
};
TramsControler.prototype.getColor = function(line) {
    for(var i = 0; i < this.colors.length; i++) {
        if (this.colors[i].line === line) {
            return (this.colors[i].color);
        }
    }
    return (undefined);
};
TramsControler.prototype.removeColor = function(line) {
    var index = 0;
    while (index < this.colors.length) {
        if (this.colors[index].line === line) {
            break;
        }
        index++;
    }
    if (index < this.colors.length) {
        this.colors.splice(index, 1);
    }
}

TramsControler.prototype.clearColors = function() {
    this.colors = [];
};
TramsControler.prototype.saveColorsInStorage = function() {
    if (typeof(Storage) !== "undefined") {
        //localStorage.setItem("trams-colors", JSON.stringify(this.colors));     
    } else {
        alert("NO STORAGE");
    }
};
TramsControler.prototype.loadColorsFromStorage = function() {
    if (typeof(Storage) !== "undefined") {
        //var colors = JSON.parse(localStorage.getItem("trams-colors"));             
    } else {
        alert("NO STORAGE");
    }
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
