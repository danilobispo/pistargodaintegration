var app = app || {};

app.Facts = Backbone.Model.extend({
    defaults: {
        factName: ""
    }
});

app.Context = Backbone.Model.extend({
    defaults: {
        factName: ""
    }
});

app.Aggregator = Backbone.Model.extend({
    defaults: {
        name: "",
        aggregatorType: ""
    }
});