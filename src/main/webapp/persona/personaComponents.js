var app = app || {};

app.factCollection = new app.FactCollection();

/**
 * Modal da criação de facts, uma modal que consiste de um campo onde o usuário escreve o nome e cadastra o fact desejado
 */
app.FactsModalView = Backbone.View.extend({
    el: '#factsModal',
    events: {
        'keypress .fact-input': 'addFact',
        'click .fact-create': 'addFactViaClick',
        'click .show-facts': 'showList',
        'click .close-modal': 'saveChangesAndExit',
        'hidden.bs.modal' : 'saveChangesAndExitViaClickOrEscape'
    },
    initialize: function () {
        this.$input = this.$('.fact-input');
        this.$showFactsButton = this.$('.show-facts');
        this.$showFactsButton.text("Show facts list");
        this.$createFactButton = this.$('#createFact');

    },
    addFact: function (e) {
        if (e.which === 13 && this.$input.val().trim()) {
            app.factCollection.add(this.newAttributes());
            this.$input.val('');
            console.log(app.factCollection);
        }
    },
    addFactViaClick: function () {
        if (this.$input.val().trim()) {
            app.factCollection.add(this.newAttributes());
            this.$input.val('');
            console.log(app.factCollection);
        } else {
            alert("Type a name to add a fact!");
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
        } else {
            if (confirm("Not enough facts to create contexts from(you need at least 1)!\n" +
                "Do you really want to leave?")) {
                this.$el.modal('toggle');
            }
        }
    },
    saveChangesAndExitViaClickOrEscape: function () {
        if (app.factCollection.length > 0) {
            // Caso em que a seta deve aparecer verde e o X desaparecer
            $("#stepOneDone").css("display", "");
            $("#stepOneNotDone").css("display", "none");
            $("#stepOneDone").css("color", "#00FF00");
            $("#stepOneLabel").html("Step 1: Edit facts for contexts");
        } else {
            // Caso em que a seta deve desaparecer verde e o X aparecer
            $("#stepOneNotDone").css("display", "");
            $("#stepOneDone").css("display", "none");
            $("#stepOneNotDone").css("color", "#FF0000");
            $("#stepOneLabel").html("Step 1: Define facts for contexts");
        }

    }
});
new app.FactsModalView();

/**
 * View utilizada para mostrar o nome dos facts e deletá-los, se necessário
 */
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
        // this.collection.on('remove', this.renderTemplateifListIsEmpty, this);

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
        console.log(this.collection);
    }
    // TODO: Arrumar isso aqui embaixo pra funfar
    //
    // ,
    // renderTemplateifListIsEmpty: function () {
    //     if(this.collection.length === 0) {
    //         this.$el.show('<h3> The list is empty!</h3>');
    //         this.template = _.template('<h3> The list is empty!</h3>');
    //     } else {
    //         this.template = _.template('<li data-id="${id}" ' +
    //             'value="<%= id%>" class="list-group-item"><%= factName %>'
    //             + '<span class="close">&times;</span></li>')
    //     }
    // }
});

/*
 Instância da view da lista de fatos
 */
new app.ListOfFacts();
/*
 Respectivamente, contexto selecionado pelo usuário na modal de criação de contextos e as decomposições selecionadas
 estão guardadas nesse objeto
 */
app.selectedContext = new app.Context();
app.selectedDecompositionsForContext = new app.DecompositionList();
/*
    Lista de contextos criados pelo usuário
 */
app.contextList = new app.ContextList();

/**
 * Combobox criada para exibir o nome dos contextos criadas pelo usuário
 */
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
        if (this.collection.length === 1) {
            app.selectedContext = option;
        }
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
    change: function (e) {
        console.log('selectedContext: ', this.collection.get(e.target.value));
        app.selectedContext = this.collection.get(e.target.value);
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


/*
    Combobox do context que armazena apenas o nome dos contextos por ora
 */
app.comboBoxContext = new app.ComboBoxContext();
var editContextOption = $("input[value=edit-context]");
app.comboBoxContext.collection.bind("add remove change reset", function () {
    app.comboBoxContext.collection.length <= 0 ?
        editContextOption.attr('disabled', true) : editContextOption.attr('disabled', false);
});

/**
 * Modal de criação de contextos e associação com decomposições com facts
 */
app.ContextModalView = Backbone.View.extend({
    el: '#contextAndFactsModal',
    events: {
        'click input[name="createOrEdit"]': 'createOrEditContextEvent',
        'keypress .context-input': 'addContext',
        'click #createContextName': 'addContextNameViaClick',
        'click #removeContext': 'removeContext',
        'click #saveContext': 'saveContext',
        'click .close-modal-context': 'exitContextModal',
        'hidden.bs.modal' : 'controlDoneButtons',
        'shown.bs.modal': 'displayMessageIfNoFacts'
    },
    initialize: function () {
        this.$createContextOption = $("input[value=create-context]");
        this.$editContextOption = $("input[value=edit-context]");
        this.$input = this.$('.context-input');
        this.collection = app.comboBoxContext.collection;
        app.comboBoxContext.collection.length <= 0 ?
            this.$editContextOption.attr('disabled', true) : this.$editContextOption.attr('disabled', false);
        this.collection.on('remove', this.changeRadioButtonIfEmpty, this)
    },
    displayMessageIfNoFacts: function() {
        if(app.factCollection.length <= 0) {
            alert('There are not enough facts to create a decomposition!\n ' +
                'Go back to the previous step and create at least one');
            this.$el.modal('toggle');
        }
    },
    createOrEditContextEvent: function (e) {
        $this = $(e.target);
        this.$('.createContext')[$this.val() === 'create-context' ? 'show' : 'hide']();
        this.$('.editContext')[$this.val() === 'edit-context' ? 'show' : 'hide']();
    },
    addContext: function (e) {
        if (e.which === 13 && this.$input.val().trim()) {
            app.comboBoxContext.add(new app.Context(this.newAttributes()));
            this.$input.val('');
            alert("Done, now go edit your context!");
            console.log(app.comboBoxContext.collection);
        }
    },
    addContextNameViaClick: function() {
        if(this.$input.val().trim()) {
            app.comboBoxContext.add(new app.Context(this.newAttributes()));
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
    removeContext: function () {
        this.collection.remove(app.comboBoxContext.el.value);
        // Remove da lista geral pra evitar bugs
        app.contextList.remove(app.comboBoxContext.el.value);
        console.log(app.comboBoxContext.collection);
    },
    changeRadioButtonIfEmpty: function () {
        if (this.collection.length <= 0) {
            this.$createContextOption.click();
        }
    },
    createNewContext: function() {
        return {
            id: app.comboBoxContext.collection.length,
            contextName: app.selectedContext.attributes.contextName,
            // Facts are inside the decompositions
            decompositionsAndFacts: app.selectedDecompositionsForContext
        }
    },
    saveContext: function () {
        console.log('app.selectedContext:', app.selectedContext);
        console.log('app.selectedContext contextName:', app.selectedContext.attributes.contextName);
        console.log('app.selectedDecompositionsForContext:', app.selectedDecompositionsForContext);
        app.contextList.add(new app.Context(this.createNewContext()));
        console.log("app.contextList:", app.contextList);
    },
    exitContextModal: function () {
        if(app.contextList.length > 0) {
            this.$el.modal('toggle');
        } else {
            if(confirm('You did not create any contexts, are you sure you want to exit?')){
                this.$el.modal('toggle');
            }
        }
    },
    controlDoneButtons: function () {
        if (app.contextList.length > 0) {
            // Caso em que a seta deve aparecer verde e o X desaparecer
            $("#stepTwoDone").css("display", "");
            $("#stepTwoNotDone").css("display", "none");
            $("#stepTwoDone").css("color", "#00FF00");
            $("#stepTwoLabel").html("Step 2: Edit contexts");
        } else {
            // Caso em que a seta deve desaparecer verde e o X aparecer
            $("#stepTwoNotDone").css("display", "");
            $("#stepTwoDone").css("display", "none");
            $("#stepTwoNotDone").css("color", "#FF0000");
            $("#stepTwoLabel").html("Step 2: Define contexts");
        }
    }
});

/*
    Instância criada para a modal de contexto
 */
new app.ContextModalView();

/**
 * Lista de decomposições criadas pelo usuário
 */
app.decompositionList = new app.DecompositionList();

/**
 * Modal de decomposição, onde selecionamos os facts associados àquela decomposição
 */
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
                if(app.selectedFacts.length > 0) {

                    //Animação para mostrar mensagem e depois apagar
                    this.$success.show();
                    setTimeout(function () {
                            $('#successDecompositionMessage').hide();
                        }, 3000
                    );
                    return true;
                } else {
                    alert("You have to choose at least one fact for this decomposition!");
                }
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
            this.$name.val('');
            console.log(app.decompositionList);
        }

    },
    newAttributes: function () {
        return {
            name: this.$name.val(),
            decompositionType: this.$andDecomposition.is(':checked') ? "AND" : "OR",
            facts: app.factCheckboxListView.optionsCollection
        }
    }

});

new app.DecompositionModalView();
app.selectedContext = new app.Context();
app.selectedFacts = new app.FactCollection();
app.selectedFactsForPersona = new app.FactCollection();

/**
 * Lista de decomposições, que possui:
 * 1. Nome
 * 2. Tipo de decomposição (OR ou AND)
 * 3. Fatos associados àquela decomposição, ou seja, os itens selecionados pelo usuário
 */
app.DecompositionListView = Backbone.View.extend({
    tagName: 'div',

    initialize: function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (decomposition) {
            $(self.el).append(new app.DecompositionListItemView({model: decomposition}).render().el);
        });
    },

    render: function (eventName) {
        _.each(this.model.models, function (decomposition) {
            $(this.el).append(new app.DecompositionListItemView({model: decomposition}).render().el);
        }, this);
        return this;
    }
});

/**
 * View de cada item para a lista de decomposições
 */
app.DecompositionListItemView = Backbone.View.extend({
    tagName: "span",
    events: {
        'click .close': 'destroyItem',
        'click input[type=checkbox]': 'addOrRemoveFromList'
    },
    template: _.template($('#tpl-decomposition-list-item').html()),
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    close: function () {
        $(this.el).unbind();
        $(this.el).remove();
    },
    destroyItem: function () {
        $(this.el).unbind();
        $(this.el).remove();
        this.model.destroy();
    },
    addOrRemoveFromList: function (e) {
        console.log(e.target);
        (e.target.checked) ?
            app.selectedDecompositionsForContext.add(this.model):
            app.selectedDecompositionsForContext.remove(this.model);
        console.log('Opção selecionada: ', this.model);
    }
});

app.decompositionListView = new app.DecompositionListView({model: app.decompositionList});
$('#aggrList').html(app.decompositionListView.render().el);

/**
 * View da lista de fatos em checkboxes, para que o usuário selecione quais ele irá utilizar
 * nesse projeto temos duas delas:
 * 1. Dentro da modal de decomposição, para selecionarmos os facts que entrarão naquela decomposição
 * 2. Na modal de criação de personas, para selecionarmos os facts da persona que estamos criando
 */
app.FactCheckboxListView = Backbone.View.extend({
    tagName: 'div',
    initialize: function (options) {
        this.optionsCollection = options.list;
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (fact) {
            $(self.el).append(new app.FactCheckboxListItemView({model: fact, list: options.list}).render().el);
        });
    },
    render: function (eventName, options) {
        _.each(this.model.models, function (fact) {
            $(this.el).append(new app.FactCheckboxListItemView({model: fact, list: options.list}).render().el);
        }, this);
        console.log('lista de opções: ', this.optionsCollection);
        return this;
    }
});

/**
    View individual utilizada na lista de checkbox para Facts
 **/
app.FactCheckboxListItemView = Backbone.View.extend({
    events: {
        'click input': 'setAsSelectedOrRemove'
    },
    template: _.template($('#tpl-fact-checkbox-list-item').html()),
    initialize: function (options) {
        this.collection = options.list;
        this.model.bind("change", this.render, this);
        this.model.bind("remove", this.unrender, this)
        this.on("setAsSelectedOrRemove", function(){
            //TODO: Se foi selecionado ou removido, verificar se algum
            // contexto se encaixa com base na proposição lógica
        });
        // this.model.bind("destroy", this.close, this);
    },
    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        console.log(this.model);
        return this;
    },
    unrender: function() {
        $(this.el).unbind();
        $(this.el).remove();
    },
    setAsSelectedOrRemove: function (e) {
        e.target.checked ? this.collection.add(this.model) : this.collection.remove(this.model);
        console.log('Opção selecionada: ', e.target.value);
    }
});

/*
    Instância da FactCheckboxListView original
    usada para mostrar os fatos selecionados dentro da modal de criar decomposições
 */
app.factCheckboxListView = new app.FactCheckboxListView({model: app.factCollection, list: app.selectedFacts});
$('#factCheckboxList').html(app.factCheckboxListView.render().el);

/*
    Lista de personas criadas pelo usuário
 */
app.personaList = new app.PersonaList();

/**
 * Modal de criação de personas
 */
app.PersonaModalView = Backbone.View.extend({
    el: '#personaCreationModal',
    events: {
        'click #createPersonaButton': 'checkDataAndSubmit'
    },
    initialize: function () {
        this.$name = this.$("#personaCreationName");
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
            console.log("description:", this.$description.val());
            console.log('Selected facts in persona modal:', app.personaModalFactCheckboxListView.optionsCollection);
            app.personaList.add(this.newAttributes());
            alert('Persona created!');
            console.log('PersonaList: ', app.personaList);
            this.$name.val().trim();
            this.$description.val().trim();
        }
    },
    newAttributes: function () {
        return {
            id: app.personaList.length,
            personaName: this.$name.val(),
            personaDescription: this.$description.val(),
            personaFacts: app.personaModalFactCheckboxListView.optionsCollection,
            personaContexts: app.selectedContextsForPersona
        }
    }
});

/*
    Utilizamos aqui uma instância da factCheckboxListView mas alteramos o elemento(onde ela será exibida)
    e a lista que ela guardará com os elementos selecionados(app.selectedFactsForPersona)
 */
app.personaModalFactCheckboxListView = new app.FactCheckboxListView({
    el: "#personaFactCheckboxList",
    model: app.factCollection,
    list: app.selectedFactsForPersona // Pois será usada na modal de criar persona, sendo portanto uma lista diferente
});


/**
 * Checkbox utilizada na modal de criação personas para mostrar os contextos criados pelo usuário
 */
app.ContextCheckboxListView = Backbone.View.extend({
    tagName: 'div',
    initialize: function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (context) {
            $(self.el).append(new app.ContextCheckboxListItemView({model: context}).render().el);
        });
    },
    render: function (eventName) {
        _.each(this.model.models, function (context) {
            $(this.el).append(new app.ContextCheckboxListItemView({model: context}).render().el);
        }, this);
        return this;
    }
});

/**
 * View individual da checkbox usada na modal de criação personas para mostrar os contextos criados pelo usuário
 */
app.ContextCheckboxListItemView = Backbone.View.extend({
    events: {
        'click input': 'setAsSelectedOrRemove'
    },
    template: _.template($('#tpl-context-checkbox-list-item').html()),
    initialize: function () {
        this.model.bind("change", this.render, this);
        // this.model.bind("destroy", this.close, this);
    },
    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        console.log(this.model);
        return this;
    },
    setAsSelectedOrRemove: function (e) {
        e.target.checked ? app.selectedContextsForPersona.add(this.model) : app.selectedContextsForPersona.remove(this.model);
        console.log('Opção selecionada: ', e.target.value);
    }
});
app.personaModalContextCheckboxListView = new app.ContextCheckboxListView({el: "#personaContextList", model: app.contextList});
app.selectedContextsForPersona = new app.ContextList();
new app.PersonaModalView();

/////////////////////
/////////////////////
/////////////////////
/////////////////////
// NAVBAR STUFF   //
/////////////////////
/////////////////////
/////////////////////
/////////////////////
/////////////////////

/* Variável para controlar a persona selecionada atualmente pelo usuário */
app.selectedPersona = new app.Persona();

/**
 * Combobox que define de qual persona serão mostrada as informações na navbar
 */
app.ComboBoxPersona = Backbone.View.extend({
    el: '#comboBoxPersona',
    template: _.template('<option data-id="${id}" value="<%= id %>" ><%= personaName %></option>'),
    initialize: function () {
        this.collection = app.personaList;
        this.collection.on('add', this.render, this);
        // this.collection.on('remove', this.unrender, this);
    },
    events: {
        'click option': 'change',
    },
    add: function (option) {
        if (this.collection.length === 1) {
            app.selectedPersona = option;
        }
    },
    render: function (model) {
        this.$el.append(this.template(model.attributes));
    },
    // unrender: function () {
    //     $('#comboBoxPersona option:selected').remove();
    // },
    // Este método é executado a cada click na combo (select).
    // Com as informações obtidas poderíamos, inclusive,
    // realizar uma requisação AJAX, por exemplo.
    change: function (e) {
        console.log('selectedPersona: ', this.collection.get(e.target.value));
        app.selectedPersona = this.collection.get(e.target.value);
        console.log('Persona selecionada!');
        new app.PersonaReviewInfoView();
    }
    // ,remove: function (option) {
    //     this.collection.remove(option);
    //     console.log(this.collection);
    // }
});

/*Instância da view definida acima*/
new app.ComboBoxPersona();

/**
 * View feita apenas para mostrar as informações da persona selecionada na sidebar
 */
app.PersonaReviewInfoView = Backbone.View.extend({
    el: '#reviewPersonaView',
    model: app.selectedPersona,
    template: _.template($('#tpl-review-persona-navbar-view').html()),
    render: function (model) {
        this.$el.append(this.template(model.attributes));
    }
});

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



