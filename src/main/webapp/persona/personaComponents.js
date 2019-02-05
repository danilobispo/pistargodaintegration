var personaUi = {};

var Context = Backbone.Model.extend({
    initialize: function () {

    },
    defaults: {
        facts: Facts,
        personaType: PersonaType
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

var HealthRiskContext = new Facts([
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

var TechnologyAversionContext = new Facts([
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

var MobilityIssue = new Facts([
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

var HomeAssistanceContext = new Facts([
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

var PhysicalActivityContext = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.WalksOrRunsAsAPhysicalActivity,
        factTypes: FactTypes.WalksOrRunsAsAPhysicalActivity,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

var MeansOfCommunication = new Facts([
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


var MeansOfInformation = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.HasCellPhone,
        factTypes: FactTypes.HasCellPhone,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

var MeansOfHelping = new Facts([
    new Fact({
        factTypesNames: FactTypesNames.HasAmbulanceAccess,
        factTypes: FactTypes.HasAmbulanceAccess,
        decompositionTypes: DecompositionTypes.OR,
        decompositionTypesNames: DecompositionTypesNames.OR
    })
]);

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
                '<i id="factDecomposition">' + this.model.attributes.decompositionTypes.toString() + '</i>');
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

            // lets add this book view to this list view
            this.$el.append(m_factView.$el);
            m_factView.render(); // lets render the book
        }
    }
});

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

var factListView = new FactListView({el: $("#healthRiskContextFacts"), model: HealthRiskContext});
factListView.render();


// uiC.PersonaButtonView = Backbone.View.extend({
//     tagName     : 'button',
//     className     : 'persona-fact-button',
//     template     : _.template($('#addPersonaFactTemplate').html(), HealthRiskContext),
//
//     initialize : function() {
//         this.render();
//     },
//     render : function() {
//         var template = _.template( $("#addPersonaFactTemplate").html(), HealthRiskContext );
//         this.el.html( template );
//         return this;
//     }
// });

// var search_view = new uiC.PersonaButtonView({ el: $("#addPersonaFactsButton") });
// search_view.render();



