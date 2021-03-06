var app = app || {};

// List of Facts
app.FactCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: app.Facts,
    localStorage: true
});

// List of contexts
app.ContextList = Backbone.Collection.extend({
    model: app.Context,
    localStorage: true
});

// List of decompositions
app.DecompositionList = Backbone.Collection.extend({
    model: app.Decomposition,
    localStorage: true,
});

// List of personas
app.PersonaList = Backbone.Collection.extend({
    model: app.Persona
});

// List of associated contexts
app.ContextAssociationList = Backbone.Collection.extend({
    model: app.GoalOrTaskAndContexts
});

// List of world predicates
app.WorldPredicateCollection = Backbone.Collection.extend({
    model: app.WorldPredicate
});

// window.WineCollection = Backbone.Collection.extend({
//     model:Wine
// });