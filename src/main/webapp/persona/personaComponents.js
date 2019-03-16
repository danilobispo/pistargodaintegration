var app = app || {};

app.factCollection = new app.FactCollection();

app.FactsModalView = Backbone.View.extend({
    el: '#factsModal',
    events: {
        'keypress .fact-input': 'addFact',
        'click .show-facts': 'showList',
        'click .close-modal': 'saveChangesAndExit'
    },
    initialize: function () {
        this.$input = this.$('.fact-input');
        this.$showFactsButton = this.$('.show-facts');
        this.$showFactsButton.text("Show facts list");
    },
    addFact: function (e) {
        if (e.which === 13 && this.$input.val().trim()) {
            app.factCollection.add(this.newAttributes());
            this.$input.val('');
            console.log(app.factCollection);
        }
    },
    newAttributes: function () {
        return {
            id: app.factCollection.length,
            factName: this.$input.val().trim()
        };
    },
    showList: function () {
        this.$showFactsButton.text() === 'Show facts list' ?
            this.$showFactsButton.text('Hide facts list') :
            this.$showFactsButton.text('Show facts list');
    },
    saveChangesAndExit: function () {
        if (app.factCollection.length > 0) {
            this.$el.modal('toggle');
            $("#stepOneDone").css("color", "#00FF00");
            $("#stepOneLabel").html("Step 1: Edit facts for contexts");
        } else {
            if (confirm("Not enough facts to create contexts from(you need at least 1)!\n" +
                "Do you really want to leave?")) {
                this.$el.modal('toggle');
            }
        }
    }
});
new app.FactsModalView();

app.ListOfFacts = Backbone.View.extend({
    el: $('#factsList'),
    template: _.template('<li data-id="${id}" ' +
        'value="<%= id%>" class="list-group-item"><%= factName %>'
        + '<span class="close">&times;</span></li>'),
    // Na inicialização unimos a coleção e a visão e
    // também definimos o evento `add` para executar
    // o callback `this.render`
    initialize: function () {
        this.collection = app.factCollection;
        this.collection.on('add', this.render, this);

    },
    events: {
        'click li span.close': 'remove',
    },
    add: function (option) {
        this.collection.add(option);
    },
    render: function (model) {
        this.$el.append(this.template(model.attributes));
    },
    // Este método é executado a cada click na combo (select).
    // Com as informações obtidas poderíamos, inclusive,
    // realizar uma requisação AJAX, por exemplo.
    remove: function (e) {
        var liElement = $(e.target.parentElement);
        // DEBUG
        // console.log($(e.target.parentElement));
        // console.log(liElement.attr("data-id"));
        this.collection.remove(liElement.attr("data-id"));
        liElement.remove();
        // DEBUG
        // console.log(this.collection);
    }
});

app.listOfFacts = new app.ListOfFacts();


app.ComboBoxContext = Backbone.View.extend({
    el: $('#selectContext'),
    template: _.template('<option data-id="${id}" value="<%= id%>" ><%= contextName %></option>'),

    // Na inicialização unimos a coleção e a visão e
    // também definimos o evento `add` para executar
    // o callback `this.render`
    initialize: function () {
        this.collection = new app.ContextList(null, this);
        this.collection.on('add', this.render, this);
        this.collection.on('remove', this.unrender, this);
    },
    events: {
        'click option': 'change',
    },
    add: function (option) {
        this.collection.add(option);
    },
    render: function (model) {
        this.$el.append(this.template(model.attributes));
    },
    unrender: function () {
        $('#selectContext option:selected').remove();
    },
    // Este método é executado a cada click na combo (select).
    // Com as informações obtidas poderíamos, inclusive,
    // realizar uma requisação AJAX, por exemplo.
    change: function () {
        var index = this.el.selectedIndex;
        var value = this.el.options[index].value;
        var text = this.el.options[index].text;
        // DEBUG
        // console.log("index: " + index + ",  value: " + value + ", text: " + text);
    },
    remove: function (option) {

        this.collection.remove(option);
        console.log(this.collection);
    }
});


app.comboBoxContext = new app.ComboBoxContext();
var editContextOption = $("input[value=edit-context]");
app.comboBoxContext.collection.bind("add remove change reset", function () {
    app.comboBoxContext.collection.length <= 0 ?
        editContextOption.attr('disabled', true) : editContextOption.attr('disabled', false);
});

app.ContextModalView = Backbone.View.extend({
    el: '#contextAndFactsModal',
    events: {
        'click input[name="createOrEdit"]': 'createOrEditContextEvent',
        'keypress .context-input': 'addContext',
        'click #removeContext': 'removeContext'
    },
    initialize: function () {
        this.$editContextOption = $("input[value=edit-context]");
        this.$input = this.$('.context-input');
        app.comboBoxContext.collection.length <= 0 ?
            this.$editContextOption.attr('disabled', true) : this.$editContextOption.attr('disabled', false);
    },
    createOrEditContextEvent: function (e) {
        $this = $(e.target);
        this.$('.createContext')[$this.val() === 'create-context' ? 'show' : 'hide']();
        this.$('.editContext')[$this.val() === 'edit-context' ? 'show' : 'hide']();
    },
    addContext: function (e) {
        if (e.which === 13 && this.$input.val().trim()) {
            app.comboBoxContext.add(new Context(this.newAttributes()));
            this.$input.val('');
            alert("Done, now go edit your context!");
            console.log(app.comboBoxContext.collection);
        }
    },
    newAttributes: function () {
        return {
            id: app.comboBoxContext.collection.length,
            contextName: this.$input.val().trim()
        };
    },
    removeContext: function (e) {
        console.log(app.comboBoxContext.el.value);
        app.comboBoxContext.collection.remove(app.comboBoxContext.el.value);
        console.log(app.comboBoxContext.collection);
    }
});

new app.ContextModalView();

app.decompositionList = new app.DecompositionList();

app.DecompositionModalView = Backbone.View.extend({
    el: '#decompositionModal',
    events: {
        'click button#decompositionCreatorButton': 'checkDataAndSubmit'
    },
    initialize: function () {
        this.$name = this.$("#decompositionNameInput");
        this.$andDecomposition = this.$("#decompositionAndOptionRadio");
        this.$orDecomposition = this.$("#decompositionOrOptionRadio");
        this.$success = this.$('#successDecompositionMessage');
    },
    checkData: function () {
        if (this.$name.val().length > 0) {
            // DEBUG
            // console.log("and:", this.$andDecomposition.is(':checked'));
            // console.log("Or:" , this.$orDecomposition.is(':checked'));
            if (this.$andDecomposition.is(':checked') || this.$orDecomposition.is(':checked')) {
                //Animação para mostrar mensagem e depois apagar
                this.$success.show();
                setTimeout(function () {
                    $('#successDecompositionMessage').hide();
                    }, 3000
                );
                return true;
            } else {
                alert('Choose an decomposition type!');
                return false;
            }
        } else {
            alert('You must type a name!');
            return false;
        }
    },
    checkDataAndSubmit: function () {
        if (this.checkData()) {
            app.decompositionList.add(this.newAttributes());
            console.log(app.decompositionList)
        }

    },
    newAttributes: function () {
        return {
            name: this.$name.val(),
            decompositionType: this.$andDecomposition.is(':checked') ? "AND" : "OR"
        }
    }

});

new app.DecompositionModalView();

app.DecompositionListView = Backbone.View.extend({
    tagName:'div',

    initialize:function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (decomposition) {
            $(self.el).append(new app.DecompositionListItemView({model:decomposition}).render().el);
        });
    },

    render:function (eventName) {
        _.each(this.model.models, function (decomposition) {
            $(this.el).append(new app.DecompositionListItemView({model:decomposition}).render().el);
        }, this);
        return this;
    }
});

app.DecompositionListItemView = Backbone.View.extend({

    tagName:"span",

    events: {
        'click .close': 'destroyItem'
    },

    template:_.template($('#tpl-decomposition-list-item').html()),

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    close:function () {
        $(this.el).unbind();
        $(this.el).remove();
    },

    destroyItem: function () {
        $(this.el).unbind();
        $(this.el).remove();
        this.model.destroy();
    }
});

app.decompositionListView = new app.DecompositionListView({model:app.decompositionList});
$('#aggrList').html(app.decompositionListView.render().el);


app.personaList = new app.PersonaList();

app.PersonaModalView = Backbone.View.extend({
    el: '#personaCreationModal',
    events: {
        'click #createPersonaButton' : 'checkDataAndSubmit'
    },
    initialize: function () {
        this.$name = this.$("#personaCreationName");
        this.$photo = this.$("#personaCreationPhoto");
        this.$description = this.$("#personaCreationDescription");
    },
    checkData: function () {
        if (this.$name.val().length > 0) {
            //TODO: Check all fields
            return true;
        } else return false;
    },
    checkDataAndSubmit: function () {
        if (this.checkData()) {
            console.log("Name: ", this.$name.val());
            console.log("photo:", this.$photo.val());
            console.log("description:" ,this.$description.val());
            app.personaList.add(this.newAttributes());
            alert('Persona created!');
            console.log(app.personaList);
            this.$name.val().trim();
            this.$description.val().trim();
        }
    },
    newAttributes: function () {
        return {
            name: this.$name.val(),
            photo: this.$photo.val() === undefined ? "": this.$photo.val(),
            description: this.$description.val()
        }
    }
});

new app.PersonaModalView();

// Views
// window.WineListView = Backbone.View.extend({
//
//     tagName:'div',
//
//     initialize:function () {
//         this.model.bind("reset", this.render, this);
//         var self = this;
//         this.model.bind("add", function (wine) {
//             $(self.el).append(new WineListItemView({model:wine}).render().el);
//         });
//     },
//
//     render:function (eventName) {
//         _.each(this.model.models, function (wine) {
//             $(this.el).append(new WineListItemView({model:wine}).render().el);
//         }, this);
//         return this;
//     }
// });

// window.WineListItemView = Backbone.View.extend({
//
//     tagName:"span",
//
//     events: {
//         'click .close': 'destroyItem'
//     },
//
//     template:_.template($('#tpl-wine-list-item').html()),
//
//     initialize:function () {
//         this.model.bind("change", this.render, this);
//         this.model.bind("destroy", this.close, this);
//     },
//
//     render:function (eventName) {
//         $(this.el).html(this.template(this.model.toJSON()));
//         return this;
//     },
//
//     close:function () {
//         $(this.el).unbind();
//         $(this.el).remove();
//     },
//
//     destroyItem: function () {
//         $(this.el).unbind();
//         $(this.el).remove();
//         this.model.destroy();
//     }
// });

// app.wineList = new WineCollection();
// app.wineListView = new WineListView({model:app.wineList});
// $('#seila').html(app.wineListView.render().el);

// For reference
// window.WineView = Backbone.View.extend({
//
//     template:_.template($('#tpl-wine-details').html()),
//
//     initialize:function () {
//         this.model.bind("change", this.render, this);
//     },
//
//     render:function (eventName) {
//         $(this.el).html(this.template(this.model.toJSON()));
//         return this;
//     },
//
//     events:{
//         "change input":"change",
//         "click .save":"saveWine",
//         "click .delete":"deleteWine"
//     },
//
//     change:function (event) {
//         var target = event.target;
//         console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
//         // You could change your model on the spot, like this:
//         // var change = {};
//         // change[target.name] = target.value;
//         // this.model.set(change);
//     },
//
//     saveWine:function () {
//         this.model.set({
//             name:$('#name').val(),
//             grapes:$('#grapes').val(),
//             country:$('#country').val(),
//             region:$('#region').val(),
//             year:$('#year').val(),
//             description:$('#description').val()
//         });
//         if (this.model.isNew()) {
//             app.wineList.add(this.model);
//             console.log(app.wineList);
//         } else {
//             this.model.save();
//         }
//         return false;
//     },
//
//     deleteWine:function () {
//         this.model.destroy({
//             success:function () {
//                 alert('Wine deleted successfully');
//             }
//         });
//         return false;
//     },
//
//     close:function () {
//         $(this.el).unbind();
//         $(this.el).empty();
//     }
// });
//
// window.HeaderView = Backbone.View.extend({
//
//     template:_.template($('#tpl-header').html()),
//
//     initialize:function () {
//         this.render();
//     },
//
//     render:function (eventName) {
//         $(this.el).html(this.template());
//         return this;
//     },
//
//     events:{
//         "click .new":"newWine"
//     },
//
//     newWine:function (event) {
//         if (app.wineView) app.wineView.close();
//         app.wineView = new WineView({model:new Wine()});
//         $('#content').html(app.wineView.render().el);
//         return false;
//     }
// });
//
// var AppRouter = Backbone.Router.extend({
//
//     routes:{
//         "":"list",
//         "wines/:id":"wineDetails"
//     },
//
//     initialize:function () {
//         $('#header').html(new HeaderView().render().el);
//     },
//
//     list:function () {
//         this.wineList = new WineCollection();
//         this.wineListView = new WineListView({model:this.wineList});
//         // this.wineList.fetch();
//         $('#sidebar').html(this.wineListView.render().el);
//     },
//
//     wineDetails:function (id) {
//         this.wine = this.wineList.get(id);
//         if (app.wineView) app.wineView.close();
//         this.wineView = new WineView({model:this.wine});
//         $('#content').html(this.wineView.render().el);
//     }
//
// });
//
// var router = new AppRouter();
// Backbone.history.start();


// TODO: Fix below
/*app.FactItemView = Backbone.View.extend({
    tagName: 'li',
    initialize: function (options) {
        // Ensure our methods keep the `this` reference to the view itself
        _.bindAll(this,'render');
        // If the model changes we need to re-render
        this.model.bind('change', this.render);
        this.render();
    },
    render: function () {
        // Clear existing row data if needed
        this.$el.empty();

        this.$el.append($('<span>' + this.model.get('factName') + '</span>'));
        return this;
    },
});


app.FactListView = Backbone.View.extend({
    collection: app.FactCollection,
    template: '',
    tagName: 'ul',

    el: '#factsList',

    events:{
        'click .destroy': 'clear'
    },

    initialize:function () {
        this.template = _.template($('#showFactsListTemplate').html());
        this.listenTo(this.collection, "change", this.render);
        _.bindAll(this, 'render'); // Bind this to all view functions

        // Bind collection changes to re-rendering
        this.collection.bind('reset', this.render);
        this.collection.bind('add', this.render);
        this.collection.bind('remove', this.render);

        this.collection.on('reset', this.render); // bind the collection reset event to render this view
        this.render();
    },
    render: function() {
        var element = this.$el;
        // Clear potential old entries first
        element.empty();


        // Go through the collection items
        this.collection.forEach(function(item) {

            // Instantiate a PeopleItem view for each
            var itemView = new app.FactItemView({
                model: item
            });

            // Render the PeopleView, and append its element
            // to the table
            element.append(itemView.render().$el);
        });

        return this;
    },
    clear: function () {
        this.model.destroy();
    }
});*/


var Context = Backbone.Model.extend({
    initialize: function () {

    },
    defaults: {
        facts: Facts,
        personaType: PersonaType,
        contextName: ""
    }
});

// List<FactTypes>
var Facts = Backbone.Collection.extend({
    initialize: function (models, options) {

    },
    defaults: {
        model: Fact
    }
});

//Fact Model
var Fact = Backbone.Model.extend({
    defaults: {
        factTypesNames: "",
        factTypes: FactTypes,
        decompositionTypes: DecompositionTypes,
        decompositionTypesNames: DecompositionTypesNames
    }
});

var PersonaType = {
    PATIENT: 1,
    DOCTOR: 2
};

var DecompositionTypes = {
    AND: 1,
    OR: 2,
    LEAF: 3
};

var DecompositionTypesNames = {
    AND: "AND",
    OR: "OR",
    LEAF: "LEAF"
};

var FactTypes = {
    HasDiabetes: 1,
    HasHBP: 2,
    Cardiac: 3,
    HasRheumatoid: 4,
    ProneToFalling: 5,
    HasOsteoporosis: 6,
    DifficultyInWalking: 7,
    HasAWheelChair: 8,
    DontLikeTechnology: 9,
    HasBadExperiencesWithTechnology: 10,
    WantsToAvoidFrustratingExperiencesWithTechnologies: 11,
    LivesWithHisOrHersChildren: 12,
    HasANurse: 13,
    LivesInAnAsylum: 14,
    HasAnAssistedLivingDevice: 15,
    WalksOrRunsAsAPhysicalActivity: 16,
    HasCellPhone: 17,
    HasInternet: 18,
    HasAmbulanceAccess: 19
};

var FactTypesNames = {
    HasDiabetes: "HasDiabetes",
    HasHBP: "HasHBP",
    Cardiac: "Cardiac",
    HasRheumatoid: "HasRheumatoid",
    ProneToFalling: "ProneToFalling",
    HasOsteoporosis: "HasOsteoporosis",
    DifficultyInWalking: "DifficultyInWalking",
    HasAWheelChair: "HasAWheelChair",
    DontLikeTechnology: "DontLikeTechnology",
    HasBadExperiencesWithTechnology: "HasBadExperiencesWithTechnology",
    WantsToAvoidFrustratingExperiencesWithTechnologies: "WantsToAvoidFrustratingExperiencesWithTechnologies",
    LivesWithHisOrHersChildren: "LivesWithHisOrHersChildren",
    HasANurse: "HasANurse",
    LivesInAnAsylum: "LivesInAnAsylum",
    HasAnAssistedLivingDevice: "HasAnAssistedLivingDevice",
    WalksOrRunsAsAPhysicalActivity: "WalksOrRunsAsAPhysicalActivity",
    HasCellPhone: "HasCellPhone",
    HasInternet: "HasInternet",
    HasAmbulanceAccess: "HasAmbulanceAccess"
};

/**************************/
/*****Facts By context*****/
/**************************/
var HealthRiskFacts = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.HasDiabetes,
        factTypes: FactTypes.HasDiabetes,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.HasHBP,
        factTypes: FactTypes.HasHBP,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.Cardiac,
        factTypes: FactTypes.Cardiac,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.HasRheumatoid,
        factTypes: FactTypes.HasRheumatoid,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.ProneToFalling,
        factTypes: FactTypes.ProneToFalling,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.HasOsteoporosis,
        factTypes: FactTypes.HasOsteoporosis,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
]);

var TechnologyAversionFacts = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.DontLikeTechnology,
        factTypes: FactTypes.DontLikeTechnology,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.HasBadExperiencesWithTechnology,
        factTypes: FactTypes.HasBadExperiencesWithTechnology,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.WantsToAvoidFrustratingExperiencesWithTechnologies,
        factTypes: FactTypes.WantsToAvoidFrustratingExperiencesWithTechnologies,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

var MobilityIssueFacts = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.DifficultyInWalking,
        factTypes: FactTypes.DifficultyInWalking,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.HasAWheelChair,
        factTypes: FactTypes.HasAWheelChair,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

var HomeAssistanceFacts = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.LivesWithHisOrHersChildren,
        factTypes: FactTypes.LivesWithHisOrHersChildren,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.HasANurse,
        factTypes: FactTypes.HasANurse,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.LivesInAnAsylum,
        factTypes: FactTypes.LivesInAnAsylum,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.HasAnAssistedLivingDevice,
        factTypes: FactTypes.HasAnAssistedLivingDevice,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

var PhysicalActivityFacts = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.WalksOrRunsAsAPhysicalActivity,
        factTypes: FactTypes.WalksOrRunsAsAPhysicalActivity,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

var MeansOfCommunicationFacts = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.HasCellPhone,
        factTypes: FactTypes.HasCellPhone,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    }),
    new Fact({
        factTypesNames: FactTypesNames.HasInternet,
        factTypes: FactTypes.HasInternet,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);


var MeansOfInformationFacts = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.HasCellPhone,
        factTypes: FactTypes.HasCellPhone,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

var MeansOfHelpingFacts = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.HasAmbulanceAccess,
        factTypes: FactTypes.HasAmbulanceAccess,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

/*******************************/
/*****END Facts By context******/
/******************************/


//
// var Book = Backbone.Model.extend({
//     defaults: {
//         ID: "",
//         BookName: "",
//         BookAge: 23
//     },
//     idAttribute: "ID",
//     initialize: function () {
//         console.log('Book has been initialized');
//         this.on("invalid", function (model, error) {
//             console.log("Houston, we have a problem: " + error)
//         });
//     },
//     constructor: function (attributes, options) {
//         console.log('Book\'s constructor had been called');
//         Backbone.Model.apply(this, arguments);
//     },
//     validate: function (attr) {
//         if (attr.ID <= 0) {
//             return "Invalid value for ID supplied."
//         }
//     }/*,
//     urlRoot: 'http://localhost:51377/api/Books'*/
// });
//
// var BooksCollection = Backbone.Collection.extend({
//     model: Book,
//     initialize: function () {
//
//         // This will be called when an item is added. pushed or unshifted
//         this.on('add', function (model) {
//             console.log('something got added');
//         });
//         // This will be called when an item is removed, popped or shifted
//         this.on('remove', function (model) {
//             console.log('something got removed');
//         });
//         // This will be called when an item is updated
//         this.on('change', function (model) {
//             console.log('something got changed');
//         });
//     },
// });

var ListOfContexts = Backbone.Collection.extend({
    initialize: function (models, options) {

    },
    defaults: {
        model: Context
    }
});

// facts: Facts,
//     personaType: PersonaType,
//     contextName: ""

//TODO: Ver se eu consigo generalizar o comportamento desses contextos
//Problema de clicar em um dos contextos e outros expandirem
var DefaultContextList = new ListOfContexts([
    new Context({
        facts: HealthRiskFacts,
        personaType: PersonaType.PATIENT,
        contextName: "Health Risk Context"
    }),
    new Context({
        facts: TechnologyAversionFacts,
        personaType: PersonaType.PATIENT,
        contextName: "Technology Aversion Context"
    }),
    new Context({
        facts: MobilityIssueFacts,
        personaType: PersonaType.PATIENT,
        contextName: "Mobility Issue Context"
    }),
    new Context({
        facts: HomeAssistanceFacts,
        personaType: PersonaType.PATIENT,
        contextName: "Home Assistance Context"
    }),
    new Context({
        facts: PhysicalActivityFacts,
        personaType: PersonaType.PATIENT,
        contextName: "Physical Activity Context"
    }),
    new Context({
        facts: MeansOfCommunicationFacts,
        personaType: PersonaType.DOCTOR,
        contextName: "Means of Communication Context"
    }),
    new Context({
        facts: MeansOfInformationFacts,
        personaType: PersonaType.DOCTOR,
        contextName: "Means of Information Context"
    }),
    new Context({
        facts: MeansOfHelpingFacts,
        personaType: PersonaType.DOCTOR,
        contextName: "Means of Helping Context"
    })
]);

//
// var bookView = Backbone.View.extend({
//     tagname: "div",
//     model: Book,
//     render: function () {
//         this.$el.html(
//             '<li>' + this.model.get("BookName") + '</li>' +
//             '<span>' + this.model.get("ID") + '</span>' + '<br>' +
//             '<span>' + this.model.get("BookAge") + '</span>');
//         return this;
//     }
// });
//
// var bookListView = Backbone.View.extend({
//     model: BooksCollection,
//
//     render: function () {
//         this.$el.html(); // lets render this view
//
//         var self = this;
//
//         for (var i = 0; i < this.model.length; ++i) {
//             // lets create a book view to render
//             var m_bookView = new bookView({model: this.model.at(i)});
//
//             // lets add this book view to this list view
//             this.$el.append(m_bookView.$el);
//             m_bookView.render(); // lets render the book
//         }
//
//         return this;
//     },
// });


var FactView = Backbone.View.extend({
    model: Fact,
    tagName: 'div',
    template: '',

    initialize: function () {
        this.template = _.template($('#addPersonaFactTemplate').html());
    },

    render: function () {
        if (this.model.attributes.decompositionTypes !== DecompositionTypes.LEAF) {
            this.$el.html(this.template(this.model.attributes) +
                '<i id="factDecomposition">' + this.model.attributes.decompositionTypesNames + '</i>');
            return this;
        } else {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    }
});

var FactListView = Backbone.View.extend({
    model: Facts,
    render: function () {
        // lets create a book view to render
        for (var i = 0; i < this.model.length; i++) {

            var m_factView = new FactView({model: this.model.at(i)});
            console.log(m_factView.model);
            // lets add this book view to this list view
            this.$el.append(m_factView.$el);
            m_factView.render(); // lets render the book
        }
    }
});

var ContextView = Backbone.View.extend({
    model: Context,
    tagName: 'div',
    template: '',

    initialize: function () {
        console.log(this.model.attributes);
        this.template = _.template($('#addPersonaContextTemplate').html());
    },

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

/*var ContextListView = Backbone.View.extend({
    model: ListOfContexts,
    render: function () {
        for (var i = 0; i < this.model.length; i++) {
            for(var j = 0; j < this.model.get('facts').length; j++){

                console.log(this.model.get('facts').at(j));
            }
            var contextView = new ContextView({model: this.model.at(i)});

            // lets add this book view to this list view
            this.$el.append(contextView.$el);
            contextView.render(); // lets render the book
        }
    }
});*/

// var bookView2 = Backbone.View.extend({
//
//     model: Book,
//     tagName: 'li',
//     template: '',
//
//     initialize: function () {
//         this.template = _.template($('#bookItem').html());
//     },
//
//     render: function () {
//         this.$el.html(this.template(this.model.attributes));
//         return this;
//     }
// });
//
// var bookListView2 = Backbone.View.extend({
//     model: BooksCollection,
//
//     render: function () {
//         this.$el.html(); // lets render this view
//
//         for (var i = 0; i < this.model.length; ++i) {
//             // lets create a book view to render
//             var m_bookView = new bookView2({model: this.model.at(i)});
//
//             // lets add this book view to this list view
//             this.$el.append(m_bookView.$el);
//             m_bookView.render(); // lets render the book
//         }
//
//         return this;
//     },
// });
//
// var book1 = new Book({ID: 1, BookName: "Book 1"});
// var book2 = new Book({ID: 2, BookName: "Book 2"});
// var book3 = new Book({ID: 3, BookName: "Book 3"});
// var book4 = new Book({ID: 4, BookName: "Book 4"});
// var book5 = new Book({ID: 5, BookName: "Book 5"});
// var bookCollection = new BooksCollection([book1, book2, book3, book4, book5]);
// var bookList = null;
//
// bookList = new bookListView({el: $("#bookList"), model: bookCollection});
// bookList.render();
//
// var bookList2 = new bookListView2({el: $("#bookDropDown"), model: bookCollection});
// bookList2.render();

var factListView = new FactListView({el: $("#healthRiskFacts"), model: HealthRiskFacts});
factListView.render();
var factListView2 = new FactListView({el: $("#technologyAversionFacts"), model: TechnologyAversionFacts});
factListView2.render();
var factListView3 = new FactListView({el: $("#mobilityIssueFacts"), model: MobilityIssueFacts});
factListView3.render();
var factListView4 = new FactListView({el: $("#homeAssistanceFacts"), model: HomeAssistanceFacts});
factListView4.render();
var factListView5 = new FactListView({el: $("#physicalActivityFacts"), model: PhysicalActivityFacts});
factListView5.render();
var factListView6 = new FactListView({el: $("#meansOfCommunicationFacts"), model: MeansOfCommunicationFacts});
factListView6.render();
var factListView7 = new FactListView({el: $("#meansOfInformationFacts"), model: MeansOfInformationFacts});
factListView7.render();
var factListView8 = new FactListView({el: $("#meansOfHelpingFacts"), model: MeansOfHelpingFacts});
factListView8.render();

// if($('#patientRadioOption').is(':checked')){
//     $("#healthRiskMenu").show();
//     $("#technologyAversionMenu").show();
//     $("#mobilityIssueMenu").show();
//     $("#homeAssistanceMenu").show();
//     $("#physicalActivityMenu").show();
//     $("#meansOfCommunicationMenu").hide();
//     $("#meansOfInformationMenu").hide();
//     $("#meansOfHelpingMenu").hide();
// } else if($('#doctorRadioOption').is(':checked')) {
//     $("#healthRiskMenu").hide();
//     $("#technologyAversionMenu").hide();
//     $("#mobilityIssueMenu").hide();
//     $("#homeAssistanceMenu").hide();
//     $("#physicalActivityMenu").hide();
//     $("#meansOfCommunicationMenu").show();
//     $("#meansOfInformationMenu").show();
//     $("#meansOfHelpingMenu").show();
// }

// var contextListView = new ContextListView({el: $("#contextContainer"), model: DefaultContextList});
// contextListView.render();


// uiC.PersonaButtonView = Backbone.View.extend({
//     tagName     : 'button',
//     className     : 'persona-fact-button',
//     template     : _.template($('#addPersonaFactTemplate').html(), HealthRiskFacts),
//
//     initialize : function() {
//         this.render();
//     },
//     render : function() {
//         var template = _.template( $("#addPersonaFactTemplate").html(), HealthRiskFacts );
//         this.el.html( template );
//         return this;
//     }
// });

// var search_view = new uiC.PersonaButtonView({ el: $("#addPersonaFactsButton") });
// search_view.render();



