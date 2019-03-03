var app = app || {};

app.Facts = Backbone.Model.extend({
   defaults: {
           factName: ""
       }
});

var FactCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: app.Facts,
    localStorage: true
});

app.FactCollection = new FactCollection();

app.FactsModalView = Backbone.View.extend({
    el: '#factsModal',
    events: {
        'keypress .fact-input': 'addFact',
        'click .show-facts': 'showList',
        'click .close-modal': 'saveChangesAndExit'
    },
    initialize :function () {
        this.$input = this.$('.fact-input');
        this.$showFactsButton = this.$('.show-facts');
        this.$showFactsButton.text("Show facts list");
    },
    addFact: function (e) {
        if (e.which === 13 && this.$input.val().trim()) {
            app.FactCollection.add(this.newAttributes());
            this.$input.val('');
            console.log(app.FactCollection);
        }
    },
    newAttributes: function () {
        return {
            factName: this.$input.val().trim()
        };
    },
    showList: function () {
        this.$showFactsButton.text() === 'Show facts list' ?
            this.$showFactsButton.text('Hide facts list') :
            this.$showFactsButton.text('Show facts list');
    },
    saveChangesAndExit: function () {
        if(app.FactCollection.length > 0){
            this.$el.modal('toggle');
            $("#stepOneDone").css("color", "#00FF00");
            $("#stepOneLabel").html("Step 1: Edit facts for contexts");
        } else {
            if (confirm("Not enough facts to create contexts from(you need at least 1)!\n" +
                "Do you really want to leave?")){
                this.$el.modal('toggle');
            }
        }
    }
});
new app.FactsModalView();

app.Context = Backbone.Model.extend({
    defaults: {
        id:'0',
        factName: ""
    }
});

app.ContextList = Backbone.Collection.extend({
    model: app.Context,
    localStorage: true
});

var ComboBox = Backbone.View.extend({
    el: $('#selectContext'),
    template: _.template('<option value="<%= id%>" ><%= factName %></option>'),

    // Na inicialização unimos a coleção e a visão e
    // também definimos o evento `add` para executar
    // o callback `this.render`
    initialize: function () {
        this.collection = new app.ContextList(null, this);
        this.collection.on('add', this.render, this);
    },
    events: {
        'click option': 'change',
    },
    add: function(option){
        this.collection.add(option);
    },
    render: function (model) {
        this.$el.append(this.template(model.attributes));
    },
    // Este método é executado a cada click na combo (select).
    // Com as informações obtidas poderíamos, inclusive,
    // realizar uma requisação AJAX, por exemplo.
    change: function () {
        var index = this.el.selectedIndex;
        var value = this.el.options[index].value;
        var text  = this.el.options[index].text;
        console.log("index: " + index+ ",  value: " + value + ", text: " + text);
    }
});

app.comboBox = new ComboBox();

app.ContextModalView = Backbone.View.extend({
    el: '#contextAndFactsModal',
    events: {
        'click input[name="createOrEdit"]': 'createOrEditContextEvent',
        'keypress .context-input': 'addContext'
    },
    initialize: function() {
      this.$input = this.$('.context-input');
    },
    createOrEditContextEvent: function(e) {
        $this = $(e.target);
        this.$('.createContext')[$this.val() === 'create' ? 'show' : 'hide']();
        this.$('.editContext')[$this.val() === 'edit' ? 'show' : 'hide']();
    },
    addContext: function (e) {
        if (e.which === 13 && this.$input.val().trim()) {
            app.comboBox.add(new Context(this.newAttributes()));
            this.$input.val('');
            alert("Done, now go edit your context!");
            console.log(app.comboBox.collection);
        }
    },
    newAttributes: function () {
        return {
            id: app.comboBox.collection.length,
            factName: this.$input.val().trim()
        };
    },
});

new app.ContextModalView();


Option = Backbone.Model.extend({
    defaults: {
        id: 0,
        label: ""
    }
});

Options = Backbone.Collection.extend();

var Combo = Backbone.View.extend({
    el: $('#optionsTest'),
    template: _.template('<option value="<%= id%>" ><%= label %></option>'),

    // Na inicialização unimos a coleção e a visão e
    // também definimos o evento `add` para executar
    // o callback `this.render`
    initialize: function () {
        this.collection = new Options(null, this);
        this.collection.on('add', this.render, this);
    },
    events: {
        'click option':   'change',
    },
    add: function(option){
        this.collection.add(option);
    },
    render: function (model) {
        this.$el.append(this.template(model.attributes));
    },
    // Este método é executado a cada click na combo (select).
    // Com as informações obtidas poderíamos, inclusive,
    // realizar uma requisação AJAX, por exemplo.
    change: function () {
        var index = this.el.selectedIndex;
        var value = this.el.options[index].value;
        var text  = this.el.options[index].text;
        console.log("index: " + index+ ",  value: " + value + ", text: " + text);
    }
});

//
// Criando a combobox (select)
//
var combo = new Combo();
combo.add(new Option());
combo.add(new Option({id: 'bra', label: "Brasil"}));
combo.add(new Option({id: 'chl', label: "Chile"}));
combo.add(new Option({id: 'arg', label: "Argentina"}));



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



