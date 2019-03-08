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

app.Persona = Backbone.Model.extend({
    defaults: {
        name: "",
        photo: "",
        description: ""
        // contexts: [""],
        // facts: [""]
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


