var app = app || {};

app.Facts = Backbone.Model.extend({
    defaults: {
        factName: ""
    }
});

app.Context = Backbone.Model.extend({
    defaults: {
        contextName: ""
    }
});

app.Decomposition = Backbone.Model.extend({
    defaults: {
        name: "",
        decompositionType: ""
    }
});

app.GlobalContext = Backbone.Model.extend({
   defaults: {
       contextName: "",
       aggregationType: "",
       facts: []
   }
});

app.Persona = Backbone.Model.extend({
    defaults: {
        personaName: "",
        personaDescription: "",
        personaFacts: "",
        personaContexts: ""
    }
});

// // Models
// window.Wine = Backbone.Model.extend({
//     defaults:{
//         "id":null,
//         "name":"",
//         "grapes":"",
//         "country":"USA",
//         "region":"California",
//         "year":"",
//         "description":"",
//         "picture":""
//     }
// });


