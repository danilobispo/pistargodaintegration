var app = app || {};

// List of Facts
var FactCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: app.Facts,
    localStorage: true
});

// List of contexts
app.ContextList = Backbone.Collection.extend({
    model: app.Context,
    localStorage: true
});

// List of aggregators
app.AggregatorList = Backbone.Collection.extend({
    model: app.Aggregator,
    localStorage: true,
});

// List of personas
app.PersonaList = Backbone.Collection.extend({
    model: app.Persona,
    localStorage: true,
});

// window.WineCollection = Backbone.Collection.extend({
//     model:Wine
// });