var app = app || {};

app.factCollection = new app.FactCollection();
app.removedFact = new app.Facts();
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
        'hidden.bs.modal': 'saveChangesAndExitViaClickOrEscape'
    },
    initialize: function () {
        this.$input = this.$('.fact-input');
        this.$showFactsButton = this.$('.show-facts');
        this.$showFactsButton.text("Show facts list");
        this.$createFactButton = this.$('#createFact');
        this.counter = 0;

    },
    addFact: function (e) {
        var trimmedInput = this.$input.val().trim();
        if (e.which === 13 && this.$input.val().trim()) {
            if (app.factCollection.where({factName: trimmedInput}).length <= 0) { // fact com nome único
                app.factCollection.add(this.newAttributes());
                this.$input.val('');
                console.log(app.factCollection);
            } else {
                alert("You have already named a fact with that name, please input another name!");
            }
        }
    },
    addFactViaClick: function () {
        var trimmedInput = this.$input.val().trim();
        if (trimmedInput) {
            if (app.factCollection.where({factName: trimmedInput}).length <= 0) { // fact com nome único
                app.factCollection.add(this.newAttributes());
                this.$input.val('');
                console.log(app.factCollection);
            } else {
                alert("You have already named a fact with that name, please input another name!");
            }
        } else {
            alert("Type a name to add a fact!");
        }
    },
    newAttributes: function () {
        return {
            factName: this.$input.val().trim(),
            id: this.counter++
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
            app.factViewButton.$el.children().children().attr("src", "images/edit_facts_for_contexts_on.svg");
            $("#stepOneDone").css("color", "#00FF00");
            $("#stepOneLabel").html("Step 1: Edit facts for contexts");

        } else {
            // Caso em que a seta deve desaparecer verde e o X aparecer
            $("#stepOneNotDone").css("display", "");
            $("#stepOneDone").css("display", "none");
            app.factViewButton.$el.children().children().attr("src", "images/edit_facts_for_contexts_off.svg");
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
    model: app.Facts,
    el: $('#factsList'),
    template: _.template('<li data-id="${id}" ' +
        'value="<%= id%>" class="list-group-item"><%= factName %>'
        + '<span class="close">&times;</span></li>'),
    // Na inicialização unimos a coleção e a visão e
    // também definimos o evento `add` para executar
    // o callback `this.render`
    initialize: function () {
        this.collection = app.factCollection;
        this.collection.bind('change', this.render, this);
        this.collection.bind('add', this.render, this);

        // this.collection.on('remove', this.renderTemplateifListIsEmpty, this);

    },
    events: {
        'click li span.close': 'remove',
    },
    // add: function (option) {
    //     this.collection.add(option);
    // },
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
        console.log("data-id:", liElement.attr("data-id"));
        console.log("e.target.parentElement: ", liElement);
        app.removedFact = this.collection.get(liElement.attr("data-id"));
        console.log("fact removido: ", app.removedFact);
        console.log(this.collection.remove(liElement.attr("data-id")).toString());
        liElement.unbind();
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
        this.on('click option', this.change, this);
    },
    events: {
        'click option': 'change',
    },
    add: function (option) {
        this.collection.add(option);
        if (this.collection.length === 1) {
            app.selectedContext = option;
            new app.SelectedContextViewTemplate({model: app.selectedContext});
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
        new app.SelectedContextViewTemplate({model: app.selectedContext});
        var index = this.el.selectedIndex;
        var value = this.el.options[index].value;
        var text = this.el.options[index].text;
        // DEBUG
        console.log("index: " + index + ",  value: " + value + ", text: " + text);
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

// /**
//  * Modal de criação de contextos e associação com decomposições com facts
//  */
// app.ContextModalView = Backbone.View.extend({
//     el: '#contextAndFactsModal',
//     events: {
//         'click input[name="createOrEdit"]': 'createOrEditContextEvent',
//         'keypress .context-input': 'addContext',
//         'click #createContextName': 'addContextNameViaClick',
//         'click #removeContext': 'removeContext',
//         'click #saveContext': 'saveContext',
//         'click .close-modal-context': 'exitContextModal',
//         'hidden.bs.modal': 'resetControlsAndControlDoneButtons',
//         'shown.bs.modal': 'displayMessageIfNoFacts'
//     },
//     initialize: function () {
//         this.nameCounter = 0;
//         this.counter = 0;
//         this.$createContextOption = $("input[value=create-context]");
//         this.$editContextOption = $("input[value=edit-context]");
//         this.$input = this.$('.context-input');
//         this.$success = this.$('#successContextMessage');
//         this.collection = app.comboBoxContext.collection;
//         app.comboBoxContext.collection.length <= 0 ?
//             this.$editContextOption.attr('disabled', true) : this.$editContextOption.attr('disabled', false);
//         this.collection.on('remove', this.changeRadioButtonIfEmpty, this)
//     },
//     displayMessageIfNoFacts: function () {
//         if (app.factCollection.length <= 0) {
//             alert('There are not enough facts to create a decomposition!\n ' +
//                 'Go back to the previous step and create at least one');
//             this.$el.modal('toggle');
//         }
//     },
//     createOrEditContextEvent: function (e) {
//         $this = $(e.target);
//         this.$('.createContext')[$this.val() === 'create-context' ? 'show' : 'hide']();
//         this.$('.editContext')[$this.val() === 'edit-context' ? 'show' : 'hide']();
//     },
//     addContext: function (e) {
//         if (e.which === 13 && this.$input.val().trim()) {
//             app.comboBoxContext.add(new app.Context(this.newAttributes()));
//             this.$input.val('');
//             alert("Done, now go edit your context!");
//             console.log(app.comboBoxContext.collection);
//         }
//     },
//     addContextNameViaClick: function () {
//         if (this.$input.val().trim()) {
//             app.comboBoxContext.add(new app.Context(this.newAttributes()));
//             this.$input.val('');
//             alert("Done, now go edit your context!");
//             console.log(app.comboBoxContext.collection);
//         }
//     },
//     newAttributes: function () {
//         return {
//             id: this.nameCounter++,
//             contextName: this.$input.val().trim()
//         };
//     },
//     removeContext: function () {
//         this.collection.remove(app.comboBoxContext.el.value);
//         // Remove da lista geral pra evitar bugs
//         app.contextList.remove(app.comboBoxContext.el.value);
//         console.log(app.comboBoxContext.collection);
//     },
//     changeRadioButtonIfEmpty: function () {
//         if (this.collection.length <= 0) {
//             this.$createContextOption.click();
//         }
//     },
//     createNewContext: function () {
//         return {
//             id: this.counter++,
//             contextName: app.selectedContext.attributes.contextName,
//             // Facts are inside the decompositions
//             decompositionsAndFacts: new app.DecompositionList(app.selectedDecompositionsForContext.toJSON())
//         }
//     },
//     saveContext: function () {
//         console.log('app.selectedContext:', app.selectedContext);
//         console.log('app.selectedContext contextName:', app.selectedContext.attributes.contextName);
//         console.log('app.selectedDecompositionsForContext:', app.selectedDecompositionsForContext);
//         this.checkDataAndSaveContext();
//
//         console.log("app.contextList:", app.contextList);
//     },
//     checkDataAndSaveContext: function () {
//         if (app.selectedDecompositionsForContext.length > 0) {
//             if (app.comboBoxContext.collection.length > 0 && app.selectedContext.attributes.contextName !== undefined) {
//                 console.log("app.selectedContext.attributes.contextName", app.selectedContext.id);
//                 if (app.contextList.get(app.selectedContext.id) === undefined) {
//                     // Novo context
//                     app.contextList.add(new app.Context(this.createNewContext()));
//                     this.$success.text("Context created succesfully!");
//                     this.$success.show();
//                     setTimeout(function () {
//                             this.$('#successContextMessage').hide();
//                         }, 3000
//                     );
//                 } else {
//                     // Context a ser editado
//                     var context = app.contextList.get(app.selectedContext.id);
//                     context.set({
//                         contextName: app.selectedContext.attributes.contextName,
//                         // Facts are inside the decompositions
//                         decompositionsAndFacts: app.selectedDecompositionsForContext
//                     }, {remove: true});
//                     this.$success.text("Context edited succesfully!");
//                     //Animação para mostrar mensagem e depois apagar
//                     this.$success.show();
//                     setTimeout(function () {
//                             this.$('#successContextMessage').hide();
//                         }, 3000
//                     );
//                 }
//             } else {
//                 alert("You have to name at least one context, then select it in Edit Existing Context option!");
//             }
//         } else {
//             alert("You have to choose at least one created decomposition!");
//         }
//     },
//     exitContextModal: function () {
//         if (app.contextList.length > 0) {
//             this.$el.modal('toggle');
//         } else {
//             if (confirm('You did not create any contexts, are you sure you want to exit?')) {
//                 this.$el.modal('toggle');
//             }
//         }
//     },
//     resetControlsAndControlDoneButtons: function () {
//         if (app.contextList.length > 0) {
//             // Caso em que a seta deve aparecer verde e o X desaparecer
//             $("#stepTwoDone").css("display", "");
//             $("#stepTwoNotDone").css("display", "none");
//             app.contextViewButton.$el.children().children().attr("src", "images/edit_contexts_on.svg");
//             $("#stepTwoDone").css("color", "#00FF00");
//             $("#stepTwoLabel").html("Step 2: Edit contexts");
//         } else {
//             // Caso em que a seta deve desaparecer verde e o X aparecer
//             $("#stepTwoNotDone").css("display", "");
//             $("#stepTwoDone").css("display", "none");
//             app.contextViewButton.$el.children().children().attr("src", "images/edit_contexts_off.svg");
//             $("#stepTwoNotDone").css("color", "#FF0000");
//             $("#stepTwoLabel").html("Step 2: Define contexts");
//         }
//     }
// });

/*
    Instância criada para a modal de contexto
 */
// new app.ContextModalView();

/**
 * Lista de decomposições criadas pelo usuário
 */
app.decompositionList = new app.DecompositionList();
app.removedContext = new app.Context();
/**
 * Modal de decomposição e contextos, onde selecionamos os facts associados àquela decomposição
 */
app.ContextAndDecompositionModalView = Backbone.View.extend({
    el: '#contextAndDecompositionModal',
    events: {
        'click button#contextCreatorButton': 'checkDataAndSubmit',
        'click button#closeDecompModal': 'recreateDecompCheckbox',
        'click button.close.btn-close': 'recreateDecompCheckbox',
        'click input[name="createOrEdit"]': 'createOrEditContextEvent',
        'click #createContextName': 'addContextNameViaClick',
        'keypress .context-input': 'addContext',
        'click #removeContext': 'removeContext',
        'click .close-modal-context': 'exitContextModal',
        'hidden.bs.modal': 'resetControlsAndControlDoneButtons',
        'shown.bs.modal': 'displayMessageIfNoFacts',
    },
    initialize: function () {
        this.nameCounter = 0;
        this.counter = 0;
        this.$createContextOption = $("input[value=create-context]");
        this.$editContextOption = $("input[value=edit-context]");
        this.$nameInput = this.$('.context-input');
        this.$andDecomposition = this.$("#decompositionAndOptionRadio");
        this.$orDecomposition = this.$("#decompositionOrOptionRadio");
        this.$success = this.$('#successContextMessage');

        this.collection = app.comboBoxContext.collection;
        app.comboBoxContext.collection.length <= 0 ?
            this.$editContextOption.attr('disabled', true) : this.$editContextOption.attr('disabled', false);
        this.collection.on('remove', this.changeRadioButtonIfEmpty, this)
    },
    displayMessageIfNoFacts: function () {
        if (app.factCollection.length <= 0) {
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
    addContextNameViaClick: function () {
        if (this.$nameInput.val().trim()) {
            var contextName = this.$nameInput.val().trim();
            var nameInput = this.$nameInput;
            var self = this;
            var repeatedNameFlag = 0;
            console.log('contextName: ', contextName);
            if (app.comboBoxContext.collection.length > 0) {
                _.each(app.comboBoxContext.collection.models, function (context) {
                    console.log('context: ', context.attributes.contextName);
                    if (context.attributes.contextName === contextName) {
                        repeatedNameFlag = 1;
                        alert("There's already a context with the name: "
                            + contextName + "\nPlease select another name for your context");
                        nameInput.val('');
                    }
                });
                if (repeatedNameFlag === 0) {
                    app.comboBoxContext.add(new app.Context(self.newAttributes()));
                    nameInput.val('');
                    alert("Done, now go edit your context!");
                    console.log(app.comboBoxContext.collection);
                }
            } else {
                app.comboBoxContext.add(new app.Context(this.newAttributes()));
                nameInput.val('');
                alert("Done, now go edit your context!");
                console.log(app.comboBoxContext.collection);
            }
        }
    },
    addContext: function (e) {
        if (e.which === 13 && this.$nameInput.val().trim()) {
            var self = this;
            var contextName = this.$nameInput.val().trim();
            var nameInput = this.$nameInput;
            var repeatedNameFlag = 0;
            // DEBUG
            // console.log('contextName: ', contextName);
            if (app.comboBoxContext.collection.length > 0) {
                _.each(app.comboBoxContext.collection.models, function (context) {
                    // DEBUG
                    // console.log('context: ', context.attributes.contextName);
                    if (context.attributes.contextName === contextName) {
                        repeatedNameFlag = 1;
                        alert("There's already a context with the name: "
                            + contextName + "\nPlease select another name for your context");
                        nameInput.val('');
                    }
                });
                if (repeatedNameFlag === 0) {
                    app.comboBoxContext.add(new app.Context(self.newAttributes()));
                    nameInput.val('');
                    alert("Done, now go edit your context!");
                    // DEBUG
                    console.log("app.comboBoxContext.collection", app.comboBoxContext.collection);
                }
            } else {
                app.comboBoxContext.add(new app.Context(this.newAttributes()));
                nameInput.val('');
                alert("Done, now go edit your context!");
                // DEBUG
                console.log("app.comboBoxContext.collection", app.comboBoxContext.collection);
            }
        }
    },
    removeContext: function () {
        console.log("app.comboBoxContext.el.value: ", app.comboBoxContext.el.value);
        app.removedContext = app.comboBoxContext.collection.get(app.comboBoxContext.el.value);
        console.log('app.removedContext:', app.removedContext);
        this.collection.remove(app.comboBoxContext.el.value);
        if (app.contextList.get(app.removedContext) !== undefined) {
            // Remove da lista geral pra evitar bugs
            app.contextList.remove(app.removedContext);
            console.log("removed from contextlist also");
            console.log("app.contextList.models", app.contextList.models);
        }
        console.log("app.comboBoxContext.collection", app.comboBoxContext.collection);

    }
    ,
    changeRadioButtonIfEmpty: function () {
        if (this.collection.length <= 0) {
            this.$createContextOption.click();
        }
    }
    ,
    checkData: function () {
        if (app.selectedContext.attributes.contextName !== "") { // selecionou contexto válido
            // DEBUG
            // console.log("and:", this.$andDecomposition.is(':checked'));
            // console.log("Or:" , this.$orDecomposition.is(':checked'));
            if (this.$andDecomposition.is(':checked') || this.$orDecomposition.is(':checked')) {
                if (app.selectedFacts.length > 0) {
                    return true;
                } else {
                    alert("You have to choose at least one fact for this decomposition!");
                }
            } else {
                alert('Choose an decomposition type!');
                return false;
            }
        } else {
            alert('You must select a context in the edit existing context option!');
            return false;
        }
    }
    ,
    checkDataAndSubmit: function () {
        if (this.checkData()) {
            this.$expressionView = $("#dpvExpressionView");
            // Fecha parênteses novamente(checar se é necessário depois)
            // var expressaoAtual = this.$expressionView.text();
            // this.$expressionView.html("<span>(" + expressaoAtual + ")</span>");

            if (app.contextList.get(app.selectedContext.id) === undefined) {
                // Novo context
                app.contextList.add(new app.Context(this.newContextAttributes()));
                this.$success.text("Context created succesfully!");
                //Animação para mostrar mensagem e depois apagar
                this.$success.show();
                setTimeout(function () {
                        this.$('#successContextMessage').hide();
                    }, 3000
                );
            } else {
                // Context a ser editado
                var context = app.contextList.get(app.selectedContext.id);
                context.set({
                    contextName: app.selectedContext.attributes.contextName,
                    // Facts are inside the decompositions
                    decompositionExpression: this.$expressionView.text()
                }, {remove: true});
                this.$success.text("Context edited succesfully!");
                //Animação para mostrar mensagem e depois apagar
                this.$success.show();
                setTimeout(function () {
                        this.$('#successContextMessage').hide();
                    }, 3000
                );
            }
            // Reseta estados anteriores
            resetDecompositionPreviewViewAndCheckboxes();
            app.decompositionPreviewView.initialize();
            this.$expressionView.html("<span>Select a fact and a decomposition to start!</span>");
            this.$nameInput.val('');
            console.log("app.contextList.models: ", app.contextList.models);
        }

    }
    ,
    newAttributes: function () {
        return {
            id: this.nameCounter++,
            contextName: this.$nameInput.val().trim()
        };
    }
    ,
    newContextAttributes: function () {
        return {
            id: app.selectedContext.attributes.id,
            contextName: app.selectedContext.attributes.contextName,
            decompositionExpression: $("#dpvExpressionView").text()
        }
    }
    ,
    exitContextModal: function () {
        if (app.contextList.length > 0) {
            this.$el.modal('toggle');
        } else {
            if (confirm('You did not create any contexts, are you sure you want to exit?')) {
                this.$el.modal('toggle');
            }
        }
    }
    ,
    resetControlsAndControlDoneButtons: function () {
        this.$expressionView = $("#dpvExpressionView");
        // Reseta variáveis
        resetDecompositionPreviewViewAndCheckboxes();
        this.$expressionView.html("<span>Select a fact and a decomposition to start!</span>");

        if (app.contextList.length > 0) {
            // Caso em que a seta deve aparecer verde e o X desaparecer
            $("#stepTwoDone").css("display", "");
            $("#stepTwoNotDone").css("display", "none");
            app.contextViewButton.$el.children().children().attr("src", "images/edit_contexts_on.svg");
            $("#stepTwoDone").css("color", "#00FF00");
            $("#stepTwoLabel").html("Step 2: Edit contexts");
        } else {
            // Caso em que a seta deve desaparecer verde e o X aparecer
            $("#stepTwoNotDone").css("display", "");
            $("#stepTwoDone").css("display", "none");
            app.contextViewButton.$el.children().children().attr("src", "images/edit_contexts_off.svg");
            $("#stepTwoNotDone").css("color", "#FF0000");
            $("#stepTwoLabel").html("Step 2: Define contexts");
        }
    }
});

app.selectedContext = new app.Context();
app.selectedFacts = new app.FactCollection();

// Instância da modal de contexto
new app.ContextAndDecompositionModalView();
// app.selectedFactsForPersona = new app.FactCollection();
// Criado para resolver o problema de fatos serem atualizados a cada nova criação de persona, então colocaremos em outro
// objeto só para evitar esse conflito
// Eg persona A possui os Facts 1, 2 e 3. Persona A é criada
// persona B possui o Fact 1. Persona B é criada e os Facts da persona A são atualizados para apenas 1
app.factsForPersona = new app.FactCollection();

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
            app.selectedDecompositionsForContext.add(this.model) :
            app.selectedDecompositionsForContext.remove(this.model);
        console.log('Decomposição selecionada: ', this.model);
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
    initialize: function (options) {
        this.optionsCollection = options.list;
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (fact) {
            $(self.el).append(new app.FactCheckboxListItemView({model: fact, list: options.list}).render().el);
        });
    },
    render: function (options) {
        _.each(this.model.models, function (fact) {
            $(this.el).append(new app.FactCheckboxListItemView({model: fact, list: options.list}).render().el);
        }, this);
        // DEBUG
        // console.log('lista de opções: ', this.optionsCollection);
        return this;
    },
    recreateList: function () {
        var self = this;
        // this.model = options.list;
        // Apaga todas as views atuais
        // var allChildren = $(self.el).children("div").remove();
        var allChildren = $(self.el).children("div").children();
        _.each(this.model.models, function (fact) {
            var i = 0;
            for (i; i < allChildren.length; i++) {
                var factName = allChildren[i].attributes.for.nodeValue;
                _.each(app.selectedFacts.models, function (selectedFact) {
                    // DEBUG
                    // console.log('Selected Fact: ', selectedFact.attributes.factName);
                    // console.log('fact: ', factName);
                    if (factName === selectedFact.attributes.factName) {
                        allChildren[i].parentNode.remove(); // Remove div completa
                    }
                });
            }
        });
    },
    /**
     * Recria lista usando factCollection original
     */
    startOver: function () {
        this.model = app.factCollection;
        var self = this;
        // Remove todos os elementos
        // $(self.el).children("div").remove();
        // Recria todos
        _.each(this.model.models, function (fact) {
            console.log('adding new view');
            $(self.el).append(new app.FactCheckboxListItemView({model: fact, list: app.selectedFacts}).render().el);
        });
        app.factCheckboxListView = new app.FactCheckboxListView({model: app.factCollection, list: app.selectedFacts});
        $('#factCheckboxList').html(app.factCheckboxListView.render({
            model: app.factCollection,
            list: app.selectedFacts
        }).el);
        // Uncheckar todos os selecionados anteriormente, se existe(m) algum(alguns)
        var checkboxes = app.factCheckboxListView.$el.children("div").children("label").children("input");

        _.each(checkboxes, function (checkbox) {
            // DEBUG
            // console.log('Is', checkbox.id, 'checkbox checked:', checkbox.checked === true);
            if (checkbox.checked === true) {
                checkbox.attr("checked", false);
            }
        });
    }
});

/**
 View individual utilizada na lista de checkbox para Facts
 **/
app.FactCheckboxListItemView = Backbone.View.extend({
    events: {
        'click input': 'setAsSelectedOrUnselect'
    },
    template: _.template($('#tpl-fact-checkbox-list-item').html()),
    initialize: function (options) {
        this.collection = options.list;
        this.model.bind("change", this.render, this);
        this.model.bind("remove", this.unrender, this);
        // this.model.bind("destroy", this.close, this);
    },
    render: function () {
        // DEBUG
        // console.log('vou render');
        $(this.el).html(this.template(this.model.toJSON()));
        console.log(this.model);
        return this;
    },
    unrender: function () {

        //DEBUG
        // console.log("app.removedFact.id typeof: ",
        // typeof (parseInt(app.removedFact.id)));
        // console.log("app.removedFact.attributes.factName).val() typeof",
        // typeof(parseInt($("#"+app.removedFact.attributes.factName).val())) );
        // A linha abaixo continua sinalizando uma string vazia sendo passada, apenas no navegador Firefox isso acontece
        // Eu fui pesquisar, e a referência disse que esse problema é específico do Firefox:
        // https://pt.stackoverflow.com/questions/159754/string-vazia-passada-para-getelementbyid
        // O Cast para number foi feito pois a IDE ficava reclamando, e de fato podia causar problemas de consistência,
        // com javascript, qualquer cuidado é pouco...
        if (parseInt(app.removedFact.id) === parseInt($("#" + app.removedFact.attributes.factName).val())) {
            this.$el.unbind();
            this.$el.remove();
        }
    },
    setAsSelectedOrUnselect: function (e) {
        e.target.checked ?
            this.collection.add(this.model) :
            this.collection.remove(this.model);
        // DEBUG
        // console.log('Opção selecionada: ', e.target.value);
        // console.log("COLLECTION: ", this.collection);
    }
});
/*
    Instância da FactCheckboxListView original
    usada para mostrar os fatos selecionados dentro da modal de criar decomposições
 */
app.factCheckboxListView = new app.FactCheckboxListView({model: app.factCollection, list: app.selectedFacts});
$('#factCheckboxList').html(app.factCheckboxListView.render().el);


app.fixedExpression = "";
app.previousDecompositionType = "";
// Coisas de world predicate que eu precisei trazer a chamada mais pra cima
app.worldPredicateList = new app.WorldPredicateCollection();
app.selectedWorldPredicates = new app.WorldPredicateCollection();

// Conforme eu fui avançando, a necessidade dessa view ficou cada vez mais explícita, a view serve para o seguinte:
// O usuário precisa ver um preview de como vai ficar a decomposição que ele tá realizando, logo essa view fará:
// Mostrará o(s) Fact(s) selecionados juntamente com a decomposição selecionada
// Se for apenas um Fact, apenas o fact será mostrado(já que and ou or pra 1 fact apenas é true sempre)
// Se forem 2 ou mais facts, é preciso adicionar a decomposição uma vez a cada n-1 facts
app.DecompositionPreviewView = Backbone.View.extend({
    tag: 'div',
    el: "#decompositionPreviewView",
    template: _.template($('#decompositionPreviewViewTemplate').html()),
    events: {
        'click #createAnotherDecompositionButton': 'finishAndStartNewExpression',
        'click #worldPredicateCreatorButton': 'openModal'
    },
    initialize: function () {
        this.$andDecomposition = $("#decompositionAndOptionRadio");
        this.$orDecomposition = $("#decompositionOrOptionRadio");
        this.decompositionType = this.$andDecomposition.is(':checked') ? "&" : "|";
        this.$createAnotherDeoompButton = $('#createAnotherDecompositionButton');


        this.$andDecomposition.bind("change", this.redefineDecompositionType);
        this.$orDecomposition.bind("change", this.redefineDecompositionType);
        this.$andDecomposition.bind("change", this.render);
        this.$orDecomposition.bind("change", this.render);

        app.selectedFacts.bind("add remove", this.render);
        app.selectedWorldPredicates.bind("add remove", this.render);
        app.selectedFacts.bind("add remove change", this.enableWorldPredicateButton);
        app.selectedWorldPredicates.bind("add remove change", this.enableWorldPredicateButton);
        this.enableWorldPredicateButton();
        this.$el.html(this.template);
        this.render();
    },
    redefineDecompositionType: function () {
        this.decompositionType = $("#decompositionAndOptionRadio").is(':checked') ? "&" : "|";
    },
    enableWorldPredicateButton: function () {
        var size = app.selectedFacts.length;
        var wpSize = app.selectedWorldPredicates.length;
        this.$worldPredicateCreatorButton = $('#worldPredicateCreatorButton');
        this.$expressionView = $("#dpvExpressionView");
        if(this.$expressionView.text() === app.fixedExpression){
            this.$worldPredicateCreatorButton.prop("disabled",true);
        } else if(size === 0 && wpSize === 0 ) {
            this.$worldPredicateCreatorButton.prop("disabled",true);
        } else {
            this.$worldPredicateCreatorButton.prop("disabled",false);
        }
    },
    openModal: function () {
        app.worldPredicateAssociationModalView.$el.modal('show');
    },
    finishAndStartNewExpression: function () {
        this.$expressionView = $("#dpvExpressionView");
        var expressaoAtual = this.$expressionView.text();
        // DEBUG
        console.log('Expressão atual: ', expressaoAtual);

        var newDecompCollection = new app.FactCollection();
        var selectedFactsNames = app.selectedFacts.pluck('factName');
        var factCollectionNames = app.factCollection.pluck('factName');
        var reducedCollection = _.difference(factCollectionNames, selectedFactsNames);
        // DEBUG
        console.log('FactCollection: ', factCollectionNames);
        console.log('SelectedFacts: ', selectedFactsNames);
        console.log('reducedCollection: ', reducedCollection);

        // World Predicates
        var newWorldPredicateDecompCollection = new app.WorldPredicateCollection();
        var selectedWorldPredicateNames = app.selectedWorldPredicates.pluck('worldPredicateName');
        var worldPredicateListNames = app.factCollection.pluck('worldPredicateName');
        var reducedCollectionWorldPredicates = _.difference(worldPredicateListNames, selectedWorldPredicateNames);
        // DEBUG
        console.log('worldPredicateListNames: ', worldPredicateListNames);
        console.log('selectedWorldPredicateNames: ', selectedWorldPredicateNames);
        console.log('reducedCollectionWorldPredicates: ', reducedCollectionWorldPredicates);


        // Selecionou todos os fatos e world predicates
        if (reducedCollection.length === 0 && reducedCollectionWorldPredicates.length === 0) {
            alert("You cannot create another decomposition, since you've selected all facts and world predicates " +
                "available.\nPlease unselect some facts or create new ones to create another decomposition!");
        } else if (app.selectedFacts.length === 0 && app.selectedWorldPredicates.length === 0) {
            alert("You have not selected any facts or world predicates, please select some and try again");
        } else { // Fatos sobrando são adicionados à nova view
            var i = 0;
            for (i; i < reducedCollection.length; i++) {
                var fact = app.factCollection.findWhere({factName: reducedCollection[i]});
                newDecompCollection.add(fact);
                // DEBUG
                console.log('Unselected Fact: ', fact);
            }
            // World predicates sobrando são adicionados à nova view
            var i = 0;
            for (i; i < reducedCollectionWorldPredicates.length; i++) {
                var wp = app.worldPredicateList.findWhere({worldPredicateName: reducedCollectionWorldPredicates[i]});
                newWorldPredicateDecompCollection.add(wp);
                // DEBUG
                console.log('Unselected world predicate: ', wp);
            }
            console.log('newDecompCollection: ', newDecompCollection.models);
            console.log('newWorldPredicateDecompCollection: ', newWorldPredicateDecompCollection.models);
            var checkboxes = app.factCheckboxListView.$el.children("div").children("label").children("input");
            var worldPredicateCheckboxes =
                app.worldPredicateCheckboxListView.$el.children("div").children("label").children("input");
            // DEBUG
            // console.log('checkboxes: ', checkboxes);
            // console.log("Are all checked?", checkboxes.not('checked').length <= 0);
            // console.log('worldPredicateCheckboxes: ', worldPredicateCheckboxes);
            // console.log("Are all checked?", worldPredicateCheckboxes.not('checked').length <= 0);
            var uncheckCounter = 0;
            // Verifica se alguma não foi selecionada
            _.each(checkboxes, function (checkbox) {
                // DEBUG
                console.log('Is', checkbox.id, 'checkbox checked:', checkbox.checked === true);
                if (checkbox.checked === false) {
                    uncheckCounter++;
                }
            });
            // Também para world predicates
            _.each(worldPredicateCheckboxes, function (checkbox) {
                // DEBUG
                console.log('Is', checkbox.id, 'checkbox checked:', checkbox.checked === true);
                if (checkbox.checked === false) {
                    uncheckCounter++;
                }
            });
            if (uncheckCounter > 0) { // Então tem pelo menos um que não foi checked
                // Fecha parênteses
                this.$expressionView.html("<span>(" + expressaoAtual + ")</span>");
                // Por fim, cria uma nova view com as novas opções de decomposição, onde o usuário poderá fazer um OR ou um
                // AND novamente
                app.factCheckboxListView.recreateList({list: newDecompCollection});
                app.worldPredicateCheckboxListView.recreateList({list: newWorldPredicateDecompCollection});
                app.chooseDecompTypeModal.$el.modal({keyboard: false, backdrop: 'static'});
            } else {
                alert("You cannot create another decomposition, since you've selected all facts available!");
            }
        }
    },
    render: function () {
        var expressionDecomp = "";
        this.decompositionType = $("#decompositionAndOptionRadio").is(':checked') ? "&" : "|";
        this.$el = $("#decompositionPreviewView");
        this.$expressionView = $("#dpvExpressionView");
        var size = app.selectedFacts.length;
        var worldPredicateSize = app.selectedWorldPredicates.length;
        console.log('size: ', size);
        console.log('worldPredicateSize', worldPredicateSize);

        if (size === 0 && worldPredicateSize === 0) {
            if(app.fixedExpression.length === 0){
                expressionDecomp = "Select a fact or world predicate and a decomposition to start!";
            } else {
                expressionDecomp = app.fixedExpression;
            }
        }
        // Size 1 ou n e world predicate size = 0
        if (size === 1 && worldPredicateSize === 0) {
            if (app.fixedExpression.length === 0) {
                expressionDecomp = app.selectedFacts.at(0).attributes.factName;
            } else {
                expressionDecomp = app.fixedExpression + app.selectedFacts.at(0).attributes.factName;
            }
            // size = n e world predicate size = 0
        } else if (size > 1 && worldPredicateSize === 0) {
            expressionDecomp = app.fixedExpression.length === 0 ?
                expressionDecomp : app.fixedExpression + expressionDecomp;
            var i;
            for (i = 0; i < size; i++) {
                if (i !== size - 1) {
                    expressionDecomp += app.selectedFacts.at(i).attributes.factName + " ";
                    expressionDecomp += this.decompositionType + " ";
                } else {
                    expressionDecomp += app.selectedFacts.at(i).attributes.factName;
                }
            }
        }

        // worldPredicateSize = 1 ou n e size = 0
        if (worldPredicateSize === 1 && size === 0) {
                expressionDecomp = app.fixedExpression.length === 0 ?
                    app.selectedWorldPredicates.at(0).attributes.worldPredicateExpression :
                    app.fixedExpression + app.selectedWorldPredicates.at(0).attributes.worldPredicateExpression;
            // worldPredicateSize = n e size = 0
        } else if (worldPredicateSize > 1 && size === 0) {
            expressionDecomp = app.fixedExpression.length === 0 ?
                expressionDecomp : app.fixedExpression + expressionDecomp;
            for (i = 0; i < worldPredicateSize; i++) {
                if (i !== worldPredicateSize - 1) {
                    expressionDecomp += app.selectedWorldPredicates.at(i).attributes.worldPredicateExpression + " ";
                    expressionDecomp += this.decompositionType + " ";
                } else {
                    expressionDecomp += app.selectedWorldPredicates.at(i).attributes.worldPredicateExpression;
                }
            }
        }

        // worldPredicateSize = 1 e size = 1
        if(worldPredicateSize === 1 && size === 1) {
            expressionDecomp = app.fixedExpression.length === 0 ?
                expressionDecomp : app.fixedExpression + expressionDecomp;
            expressionDecomp += app.selectedFacts.at(0).attributes.factName + " ";
            expressionDecomp += this.decompositionType + " ";
            expressionDecomp += app.selectedWorldPredicates.at(0).attributes.worldPredicateExpression;

        }

        // worldPredicateSize = n e size = 1
        if(worldPredicateSize > 1 && size === 1) {
            expressionDecomp = app.fixedExpression.length === 0 ?
                expressionDecomp : app.fixedExpression + expressionDecomp;

            expressionDecomp += app.selectedFacts.at(0).attributes.factName + " ";
            expressionDecomp += this.decompositionType + " ";
            for (i = 0; i < worldPredicateSize; i++) {
                if (i !== worldPredicateSize - 1) {
                    expressionDecomp += app.selectedWorldPredicates.at(i).attributes.worldPredicateExpression + " ";
                    expressionDecomp += this.decompositionType + " ";
                } else {
                    expressionDecomp += app.selectedWorldPredicates.at(i).attributes.worldPredicateExpression;
                }
            }
        }

        // worldPredicateSize = 1 e size = n
        if(worldPredicateSize === 1 && size > 1) {
            expressionDecomp = app.fixedExpression.length === 0 ?
                expressionDecomp : app.fixedExpression + expressionDecomp;
            for (i = 0; i < size; i++) {
                expressionDecomp += app.selectedFacts.at(i).attributes.factName + " ";
                expressionDecomp += this.decompositionType + " ";
            }
            expressionDecomp += app.selectedWorldPredicates.at(0).attributes.worldPredicateExpression + " ";
        }

        // worldPredicateSize = n e size = n
        if(worldPredicateSize > 1 && size > 1){
            expressionDecomp = app.fixedExpression.length === 0 ?
                expressionDecomp : app.fixedExpression + expressionDecomp;
            for (i = 0; i < size; i++) {
                expressionDecomp += app.selectedFacts.at(i).attributes.factName + " ";
                expressionDecomp += this.decompositionType + " ";
            }
            for (i = 0; i < worldPredicateSize; i++) {
                if (i !== worldPredicateSize - 1) {
                    expressionDecomp += app.selectedWorldPredicates.at(i).attributes.worldPredicateExpression + " ";
                    expressionDecomp += this.decompositionType + " ";
                } else {
                    expressionDecomp += app.selectedWorldPredicates.at(i).attributes.worldPredicateExpression;
                }
            }
        }

        // Desativa o botão logo após a operação de criar outra decomposição
        $('#worldPredicateCreatorButton').prop('disabled', true);
        // DEBUG
        console.log("Expressão: ", expressionDecomp);
        this.$expressionView.html(expressionDecomp);
        return this;
    },
    fixExpressionAndStartNewOne: function (decompType) {
        console.log("fixExpressionAndStartNewOne() init function");
        console.log('Decomposition type: ', decompType);
        // remove os fatos já selecionados, pra evitar bugs
        app.selectedFacts.reset();
        this.$expressionView = $("#dpvExpressionView");
        var fixedExpression = this.$expressionView.text();
        // Impedir que o que for escrito a partir de agora interfira na expressão anterior, que já foi "fechada"
        var expressionDecompPosition = fixedExpression.lastIndexOf(")");
        console.log('decompExpressionPosition: ', expressionDecompPosition);
        if (expressionDecompPosition !== -1) {
            app.fixedExpression = fixedExpression.substring(0, expressionDecompPosition + 1);
        }
        // Adiciona a nova decomposição ao final da expressão, depois libera o uso da expressão para o usuário
        app.fixedExpression += " " + decompType + " ";
        console.log("app.fixedExpression", app.fixedExpression);
    }
});

app.decompositionPreviewView = new app.DecompositionPreviewView();

app.ChooseDecompTypeModal = Backbone.View.extend({
    el: '#chooseDecompTypeModal',
    events: {
        'click button#confirmNewDecompositionType': 'checkData',
        'click button#closeChooseDecompModal': 'checkIfButtonIsChecked',
        'click button.close.btn-close': 'checkIfButtonIsChecked',
    },
    initialize: function () {
        this.$name = this.$("#decompositionNameInput");
        this.$previousAndDecomposition = this.$("#previousDecompositionAndOptionRadio");
        this.$previousOrDecomposition = this.$("#previousDecompositionOrOptionRadio");
    },
    checkData: function () {
        // DEBUG
        console.log("and:", this.$previousAndDecomposition.is(':checked'));
        console.log("Or:", this.$previousOrDecomposition.is(':checked'));
        if (this.$previousOrDecomposition.is(':checked') || this.$previousAndDecomposition.is(':checked')) {
            return true;
        } else {
            alert('Choose an decomposition type!');
            return false;
        }
    },
    checkIfButtonIsChecked: function () {
        console.log("checkIfButtonIsChecked init function");
        if (this.checkData()) {
            this.submitPreviousDecomposition();
        }
    },
    submitPreviousDecomposition: function () {
        var decompType = this.$previousOrDecomposition.is(':checked') ? "|" : "&";
        app.decompositionPreviewView.fixExpressionAndStartNewOne(decompType);
        app.decompositionPreviewView.render();
        this.$el.modal('hide');
    }
});

app.chooseDecompTypeModal = new app.ChooseDecompTypeModal();

// // // // // // // // //
// // // // // // // // //
// World Predicate stuff//
// // // // // // // // //
// // // // // // // // //
// // // // // // // // //

app.worldPredicateList = new app.WorldPredicateCollection();
app.selectedWorldPredicates = new app.WorldPredicateCollection();
// app.worldPredicateComboBox = new app.WorldPredicateComboBox();

// app.selectedWorldPredicate = new app.Context();
// app.removedWorldPredicate = new app.Context();
// app.selectedFactsForWorldPredicates = new app.FactCollection();
// app.fixedExpressionForWorldPredicate = "";

function resetDecompositionPreviewViewAndCheckboxes() {
    app.fixedExpression = "";
    app.selectedFacts.reset();
    app.selectedWorldPredicates.reset();
    // Refaz as listas originais
    app.factCheckboxListView.startOver();
    app.worldPredicateCheckboxListView.startOver();
    app.decompositionPreviewView.initialize();
}

/**
 * Modal de decomposição, onde selecionamos os facts associados àquela decomposição
 */

app.WorldPredicateAssociationModalView = Backbone.View.extend({
    el: '#worldPredicateAssociationModal',
    events: {
        'click button#worldPredicateCreatorButton': 'checkDataAndSubmit',
        'click #createWorldPredicateName': 'addContextNameViaClick',
        'keypress .wp-input': 'addContext',
        'shown.bs.modal': 'displayMessageIfNoFacts',
    },
    initialize: function () {
        this.nameCounter = 0;
        this.$nameInput = this.$('.wp-input');
    },
    addContextNameViaClick: function () {
        if (this.$nameInput.val().trim()) {
            var worldPredicateName = this.$nameInput.val().trim();
            var nameInput = this.$nameInput;
            var self = this;
            var repeatedNameFlag = 0;
            console.log('worldPredicateName: ', worldPredicateName);
            if (app.worldPredicateList.length > 0) {
                _.each(app.worldPredicateList.models, function (worldPredicate) {
                    console.log('worldPredicateName: ', worldPredicate.attributes.worldPredicateName);
                    if (worldPredicate.attributes.worldPredicateName === worldPredicateName) {
                        repeatedNameFlag = 1;
                        alert("There's already a world predicate with the name: "
                            + worldPredicateName + "\nPlease select another name for your world predicate");
                        nameInput.val('');
                    }
                });
                if (repeatedNameFlag === 0) {
                    app.worldPredicateList.add(new app.WorldPredicate(self.newAttributes()));
                    nameInput.val('');
                    resetDecompositionPreviewViewAndCheckboxes();
                    alert("Your world predicate has been created!");
                    console.log("app.worldPredicateList.models", app.worldPredicateList.models);
                    self.$el.modal('toggle');
                }
            } else {
                app.worldPredicateList.add(new app.WorldPredicate(this.newAttributes()));
                nameInput.val('');
                resetDecompositionPreviewViewAndCheckboxes();
                alert("Your world predicate has been created!");
                console.log("app.worldPredicateList.models", app.worldPredicateList.models);
                this.$el.modal('toggle');
            }
        }
    },
    addContext: function (e) {
        if (e.which === 13 && this.$nameInput.val().trim()) {
            var self = this;
            var worldPredicateName = this.$nameInput.val().trim();
            var nameInput = this.$nameInput;
            var repeatedNameFlag = 0;
            // DEBUG
            // console.log('worldPredicateName: ', worldPredicateName);
            if (app.worldPredicateList.length > 0) {
                _.each(app.worldPredicateList.models, function (worldPredicate) {
                    // DEBUG
                    // console.log('worldPredicate: ', worldPredicate.attributes.worldPredicateName);
                    if (worldPredicate.attributes.worldPredicateName === worldPredicateName) {
                        repeatedNameFlag = 1;
                        alert("There's already a world predicate with the name: "
                            + worldPredicateName + "\nPlease select another name for your world predicate");
                        nameInput.val('');
                    }
                });
                if (repeatedNameFlag === 0) {
                    app.worldPredicateList.add(new app.WorldPredicate(self.newAttributes()));
                    nameInput.val('');
                    resetDecompositionPreviewViewAndCheckboxes();
                    alert("Your world predicate has been created!");
                    // DEBUG
                    console.log("app.worldPredicateList.models", app.worldPredicateList.models);
                    self.$el.modal('toggle');
                }
            } else {
                app.worldPredicateList.add(new app.WorldPredicate(this.newAttributes()));
                nameInput.val('');
                resetDecompositionPreviewViewAndCheckboxes();
                alert("Your world predicate has been created!");
                // DEBUG
                console.log("app.worldPredicateList.models", app.worldPredicateList.models);
                this.$el.modal('toggle');
            }
        }
    },
    newAttributes: function () {
        return {
            id: this.nameCounter++,
            worldPredicateName: this.$nameInput.val().trim(),
            worldPredicateExpression: "("+$("#dpvExpressionView").text()+")"
        };
    }
});

app.worldPredicateAssociationModalView = new app.WorldPredicateAssociationModalView();

app.WorldPredicateCheckboxListView = Backbone.View.extend({
    tagName: 'div',
    initialize: function () {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (worldPredicate) {
            $(self.el).append(new app.WorldPredicateCheckboxListItemView({
                model: worldPredicate,
                list: app.selectedWorldPredicates
            }).render().el);
        });
    },
    render: function (eventName) {
        _.each(this.model.models, function (worldPredicate) {
            $(this.el).append(new app.WorldPredicateCheckboxListItemView({
                model: worldPredicate,
                list: app.selectedWorldPredicates
            }).render().el);
        }, this);
        return this;
    },
    recreateList: function () {
        var self = this;
        // this.model = options.list;
        // Apaga todas as views atuais
        // var allChildren = $(self.el).children("div").remove();
        var allChildren = $(self.el).children("div").children();
        _.each(this.model.models, function (fact) {
            var i = 0;
            for (i; i < allChildren.length; i++) {
                var factName = allChildren[i].attributes.for.nodeValue;
                _.each(app.selectedWorldPredicates.models, function (selectedWorldPredicates) {
                    // DEBUG
                    // console.log('Selected world predicate: ', selectedWorldPredicates.attributes.worldPredicateName);
                    // console.log('world predicate: ', worldPredicateName);
                    if (factName === selectedWorldPredicates.attributes.worldPredicateName) {
                        allChildren[i].parentNode.remove(); // Remove div completa
                    }
                });
            }
        });
    },
    /**
     * Recria lista usando worldPredicateList original
     */
    startOver: function () {
        this.model = app.worldPredicateList;
        var self = this;
        // Remove todos os elementos
        // $(self.el).children("div").remove();
        // Recria todos
        _.each(this.model.models, function (worldPredicate) {
            console.log('adding new view');
            $(self.el).append(new app.WorldPredicateCheckboxListItemView(
                {model: worldPredicate, list: app.selectedWorldPredicates}).render().el);
        });
        app.worldPredicateCheckboxListView = new app.WorldPredicateCheckboxListView(
            {model: app.worldPredicateList, list: app.selectedWorldPredicates});
        $('#worldPredicateList').html(app.worldPredicateCheckboxListView.render({
            model: app.worldPredicateList,
            list: app.selectedWorldPredicates
        }).el);
        // Uncheckar todos os selecionados anteriormente, se existe(m) algum(alguns)
        var checkboxes = app.worldPredicateCheckboxListView.$el.children("div").children("label").children("input");
        _.each(checkboxes, function (checkbox) {
            // DEBUG
            // console.log('Is', checkbox.id, 'checkbox checked:', checkbox.checked === true);
            if (checkbox.checked === true) {
                checkbox.attr("checked", false);
            }
        });
    }
});

/**
 * View individual da checkbox usada na modal de criação personas para mostrar os contextos criados pelo usuário
 */
app.WorldPredicateCheckboxListItemView = Backbone.View.extend({
    events: {
        'click input': 'setAsSelectedOrUnselect'
    },
    template: _.template($('#tpl-world-predicate-checkbox-list-item').html()),
    initialize: function (options) {
        this.collection = options.list;
        this.model.bind("change", this.render, this);
        this.model.bind("remove", this.unrender, this);
        // this.model.bind("destroy", this.close, this);
    },
    render: function (eventName) {
        console.log("app.app.WorldPredicateCheckboxListItemView render called");
        $(this.el).html(this.template(this.model.toJSON()));
        console.log(this.model);
        return this;
    },
    // Comentado pois wp's não terão opção pra remoção
    /*unrender: function () {
        console.log("Unrender called");
        //DEBUG
        // console.log("app.removedFact.id typeof: ",
        // typeof (parseInt(app.removedFact.id)));
        // console.log("app.removedFact.attributes.factName).val() typeof",
        // typeof(parseInt($("#"+app.removedFact.attributes.factName).val())) );
        // A linha abaixo continua sinalizando uma string vazia sendo passada, apenas no navegador Firefox isso acontece
        // Eu fui pesquisar, e a referência disse que esse problema é específico do Firefox:
        // https://pt.stackoverflow.com/questions/159754/string-vazia-passada-para-getelementbyid
        // O Cast para number foi feito pois a IDE ficava reclamando, e de fato podia causar problemas de consistência,
        // com javascript, qualquer cuidado é pouco...
        // console.log("this.$el", this.$el);
        if (parseInt(app.removedContext.id) === parseInt($("#" + app.removedContext.attributes.contextName).val())) {
            this.$el.unbind();
            this.$el.remove();
        }
    },*/
    setAsSelectedOrUnselect: function (e) {
        e.target.checked ? this.collection.add(this.model) : this.collection.remove(this.model);
        console.log('Opção selecionada: ', e.target.value);
        console.log('app.WorldPredicateCheckboxListItemView setAsSelectedOrUnselect this.collection.models: ',
            this.collection.models);
    }
});

app.worldPredicateCheckboxListView = new app.WorldPredicateCheckboxListView({
    el: "#worldPredicateList",
    model: app.worldPredicateList,
    list: app.selectedWorldPredicates
});



// // // // // // // // // // //
// // // // // // // // // // //
// END World Predicate stuff //
// // // // // // // // // // //
// // // // // // // // // // //
// // // // // // // // // // //


/*
    Lista de personas criadas pelo usuário
 */
/* Variável para controlar a persona selecionada atualmente pelo usuário */
app.selectedPersona = new app.Persona();
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
        this.counter = 0;
        this.$name = this.$("#personaCreationName");
        this.$description = this.$("#personaCreationDescription");
    },
    checkData: function () {
        if (this.$name.val().length > 0) {
            if (app.selectedContextsForPersona.length > 0) {
                return true;
            } else {
                alert("You must select at least one context to create a valid Persona!");
                return false;
            }
        } else {
            alert("You must give a name to your persona!");
            return false;
        }
    },
    checkDataAndSubmit: function () {
        if (this.checkData()) {
            console.log("Name: ", this.$name.val());
            console.log("description:", this.$description.val());
            // console.log('Selected facts in persona modal:', app.personaModalFactCheckboxListView.optionsCollection);

            app.personaList.add(new app.Persona(this.newAttributes()));
            if (app.personaList.length === 1) {
                app.selectedPersona = app.personaList.at(0);
                new app.PersonaReviewInfoView({model: app.selectedPersona});
            }
            alert('Persona created!');
            console.log('PersonaList: ', app.personaList);
            this.$name.val('');
            this.$description.val('');
        }
    },
    newAttributes: function () {
        return {
            id: this.counter++,
            personaName: this.$name.val(),
            personaDescription: this.$description.val(),
            // personaFacts: new app.FactCollection(app.selectedFactsForPersona.toJSON()),
            personaContexts: new app.ContextList(app.selectedContextsForPersona.toJSON())
        }
    }
});

/*
    Utilizamos aqui uma instância da factCheckboxListView mas alteramos o elemento(onde ela será exibida)
    e a lista que ela guardará com os elementos selecionados(app.selectedFactsForPersona)
 */
/*24-09-2019 - Essa checkboxListView, apesar de funcional, será comentada pois não será utilizada na primeira versão do
Persona PiStarGODA, apesar de funcional*/
// app.personaModalFactCheckboxListView = new app.FactCheckboxListView({
//     el: "#personaFactCheckboxList",
//     model: app.factCollection,
//     list: app.selectedFactsForPersona // Pois será usada na modal de criar persona, sendo portanto uma lista diferente
// });


/**
 * Checkbox utilizada na modal de criação personas para mostrar os contextos criados pelo usuário
 */
app.ContextCheckboxListView = Backbone.View.extend({
    tagName: 'div',
    initialize: function () {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (context) {
            $(self.el).append(new app.ContextCheckboxListItemView({
                model: context,
                list: app.selectedContextsForPersona
            }).render().el);
        });
    },
    render: function (eventName) {
        _.each(this.model.models, function (context) {
            $(this.el).append(new app.ContextCheckboxListItemView({
                model: context,
                list: app.selectedContextsForPersona
            }).render().el);
        }, this);
        return this;
    }
});

/**
 * View individual da checkbox usada na modal de criação personas para mostrar os contextos criados pelo usuário
 */
app.ContextCheckboxListItemView = Backbone.View.extend({
    events: {
        'click input': 'setAsSelectedOrUnselect'
    },
    template: _.template($('#tpl-context-checkbox-list-item').html()),
    initialize: function (options) {
        this.collection = options.list;
        this.model.bind("change", this.render, this);
        this.model.bind("remove", this.unrender, this);
        // this.model.bind("destroy", this.close, this);
    },
    render: function (eventName) {
        console.log("app.ContextCheckboxListItemView render called");
        $(this.el).html(this.template(this.model.toJSON()));
        console.log(this.model);
        return this;
    },
    unrender: function () {
        console.log("Unrender called");
        //DEBUG
        // console.log("app.removedFact.id typeof: ",
        // typeof (parseInt(app.removedFact.id)));
        // console.log("app.removedFact.attributes.factName).val() typeof",
        // typeof(parseInt($("#"+app.removedFact.attributes.factName).val())) );
        // A linha abaixo continua sinalizando uma string vazia sendo passada, apenas no navegador Firefox isso acontece
        // Eu fui pesquisar, e a referência disse que esse problema é específico do Firefox:
        // https://pt.stackoverflow.com/questions/159754/string-vazia-passada-para-getelementbyid
        // O Cast para number foi feito pois a IDE ficava reclamando, e de fato podia causar problemas de consistência,
        // com javascript, qualquer cuidado é pouco...
        // console.log("this.$el", this.$el);
        if (parseInt(app.removedContext.id) === parseInt($("#" + app.removedContext.attributes.contextName).val())) {
            this.$el.unbind();
            this.$el.remove();
        }
    },
    setAsSelectedOrUnselect: function (e) {
        e.target.checked ? this.collection.add(this.model) : this.collection.remove(this.model);
        console.log('Opção selecionada: ', e.target.value);
        console.log('ContextCheckboxListItemView setAsSelectedOrUnselect this.collection.models: ',
            this.collection.models);
    }
});
app.selectedContextsForPersona = new app.ContextList();
new app.PersonaModalView();
app.personaModalContextCheckboxListView = new app.ContextCheckboxListView({
    el: "#personaContextList",
    model: app.contextList,
    list: app.selectedContextsForPersona
});

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


/**
 * Combobox que define de qual persona serão mostrada as informações na navbar
 */
app.ComboBoxPersona = Backbone.View.extend({
    el: $('#selectPersona'),
    template: _.template('<option data-id="<%= id %>" ' +
        'value="<%= id %>" ' +
        'title="<%= personaName %>"' +
        'label="<%= personaName %>"><%= personaName %></option>'),

    // Na inicialização unimos a coleção e a visão e
    // também definimos o evento `add` para executar
    // o callback `this.render`
    initialize: function () {
        this.collection = app.personaList;
        this.collection.on('add', this.render, this);
        this.collection.on('remove', this.unrender, this);
    },
    events: {
        'click option': 'change',
    },
    add: function (option) {
        this.collection.add(option);
        if (this.collection.length === 1) {
            app.selectedPersona = option;
        }
    },
    render: function (model) {
        this.$el.append(this.template(model.attributes));
    },
    unrender: function () {
        $('#comboBoxPersona option:selected').unbind();
        $('#comboBoxPersona option:selected').remove();
    },
    // Este método é executado a cada click na combo (select).
    // Com as informações obtidas poderíamos, inclusive,
    // realizar uma requisação AJAX, por exemplo.
    change: function (e) {
        console.log('selectedPersona: ', this.collection.get(e.target.value));
        app.selectedPersona = this.collection.get(e.target.value);
        new app.PersonaReviewInfoView({model: app.selectedPersona});
        console.log('target:', e.target);
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

/*Instância da view definida acima*/
app.comboBoxPersona = new app.ComboBoxPersona();

/**
 * View feita apenas para mostrar as informações da persona selecionada na sidebar
 */
app.PersonaReviewInfoView = Backbone.View.extend({
    el: '#reviewPersonaView',
    template: _.template($('#tpl-review-persona-navbar-view').html()),
    initialize: function () {
        this.model = app.selectedPersona;
        this.listenTo(this.model, 'change', this.render);
        // this.$factsMenu = this.$('#factsMenu');
        this.$contextsMenu = this.$('#contextsMenu');
        // this.$factsMenu.empty();
        // this.$contextsMenu.empty();
        this.render();
    },
    render: function (model) {
        $(this.el).html(this.template(this.model.attributes));
        // this.renderFacts();
        // this.renderContexts();
        console.log('SelectedPersona: ', app.selectedPersona);
        return this;
    }
    /*,renderFacts: function () {
        if(app.selectedPersona.attributes.personaFacts.models.length === 0) {
            this.$factsMenu.hide();
        } else {
            this.$factsMenu.show();
            _.each(app.selectedPersona.attributes.personaFacts.models, function (fact) {
                $("#factsSubmenu").append("<li><span>" + fact.attributes.factName + "</span></li>");
                console.log(fact.attributes.factName);
            });
        }

    },
    renderContexts: function () {
        if(app.selectedPersona.attributes.personaContexts.models.length === 0) {
            this.$contextsMenu.hide();
        } else {
            this.$contextsMenu.show();
            _.each(app.selectedPersona.attributes.personaContexts.models, function (fact) {
                $("#contextsSubmenu").append("<li><span>" + fact.attributes.contextName + "</span></li>");
                console.log(fact.attributes.contextName);
            });
        }
    }*/
});


// // // // // // // // // // //
// // // // // // // // // // //
// // // // // // // // // // //
// Context Association Stuff  //
// // // // // // // // // // //
// // // // // // // // // // //
// // // // // // // // // // //


// Verifica se o botão do terceiro passo foi clicado, e grava o estado atual nessa variável,
// vale mais a pena que acessar toda vez o elemento e ver sua propriedade
app.stepThreeSelected = false;
// Guarda o id do último elemento clicado pelo usuário, inicializado como null
app.selectedElement = null;
// Lista que guarda os contextos selecionados para o goal ou task selecionados atualmente,
// durante a criação, o objeto passa uma cópia dos contextos selecionados e continua funcionando
// como lista global, mas agora para outros objetos
app.selectedContextsForGoalOrTask = new app.ContextList();
// Lista que guarda os goals ou tasks e seus contextos associados
app.contextAssociationList = new app.ContextAssociationList();

app.ContextAssociationModalView = Backbone.View.extend({
    el: '#contextAssociationModal',
    events: {
        'click button#CAdecompositionCreatorButton': 'checkDataAndSubmit'
    },
    initialize: function (options) {
        this.$andDecomposition = this.$("#CAdecompositionAndOptionRadio");
        this.$orDecomposition = this.$("#CAdecompositionOrOptionRadio");
        this.$success = this.$('#CAsuccessDecompositionMessage');
        this.$el.on('hidden.bs.modal', this.closeModal);
    },
    checkData: function () {
        // DEBUG
        console.log("and:", this.$andDecomposition.is(':checked'));
        console.log("Or:", this.$orDecomposition.is(':checked'));
        if (this.$andDecomposition.is(':checked') || this.$orDecomposition.is(':checked')) {
            if (app.selectedContextsForGoalOrTask.length > 0) {
                return true;
            } else {
                alert("You have to choose at least one context for this context association!");
            }
        } else {
            alert('Choose an decomposition type!');
            return false;
        }
    },
    checkDataAndSubmit: function () {
        if (this.checkData()) {
            this.$expressionView = $("#caDpvExpressionView");
            // Fecha parênteses novamente(checar se é necessário depois)
            // var expressaoAtual = this.$expressionView.text();
            // this.$expressionView.html("<span>(" + expressaoAtual + ")</span>");

            if (app.contextAssociationList.get(app.selectedElement.attributes.id) === undefined) {
                // Novo goal ou task
                //Animação para mostrar mensagem e depois apagar
                app.contextAssociationList.add(this.newAttributes());
                this.$success.text("Context association created!");
                this.$success.show();
                setTimeout(function () {
                        $('#CAsuccessDecompositionMessage').hide();
                    }, 3000
                );
            } else {
                // Goal ou task editado
                var goalOrTask = app.contextAssociationList.get(app.selectedElement.attributes.id);
                goalOrTask.set({
                    contextExpression: $("#caDpvExpressionView").text()
                    // decompositionType: this.$andDecomposition.is(':checked') ? "AND" : "OR",
                }, {remove: true});
                this.$success.text("Context association edited!");
                this.$success.show();
                //Animação para mostrar mensagem e depois apagar
                setTimeout(function () {
                        $('#CAsuccessDecompositionMessage').hide();
                    }, 3000
                );
            }

            ui.currentElement.prop('customProperties/creationProperty',
                'assertion condition ' + this.$expressionView.text());
            // Reseta estados anteriores
            app.contextAsssociationFixedExpression = "";
            app.selectedContextsForGoalOrTask.reset();
            // Refaz a lista original
            app.contextCheckboxListView.startOver();
            app.contextAssociationDecompositionPreviewView.initialize();
            this.$expressionView.html("<span>Select a context and a decomposition to start!</span>");
            console.log("app.contextAssociationList.models: ", app.contextAssociationList.models);
        }

    },
    newAttributes: function () {
        return {
            id: app.selectedElement.attributes.id,
            goalOrTask: app.selectedElement.attributes.type.substr(6).toString(),
            contextExpression: $("#caDpvExpressionView").text()
            // ,decompositionType: this.$andDecomposition.is(':checked') ? "AND" : "OR",

        }
    },
    show: function () {
        this.$el.modal('show');
    },
    closeModal: function () {
        // Remove a tooltip do topo, pra não confundir que o modo ainda está ativo
        ui.changeStatus('');
        // Desativa o modo de associação de contextos
        app.stepThreeSelected = false;
        this.$expressionView = $("#caDpvExpressionView");
        // Reseta variáveis
        app.fixedExpression = "";
        app.selectedContextsForGoalOrTask.reset();
        // Refaz a lista original
        app.contextCheckboxListView.startOver();
        app.contextAssociationDecompositionPreviewView.initialize();
        this.$expressionView.html("<span>Select a context and a decomposition to start!</span>");
        // DEBUG
        console.log("app.contextAssociationList.models: ", app.contextAssociationList.models);
    }
});

app.contextAssociationModalView = new app.ContextAssociationModalView({element: ui.currentElement});

app.GoalOrTaskInfoView = Backbone.View.extend({
    el: "#goalOrTaskInfo",
    template: _.template($('#selectedGoalOrTaskTemplate').html()),
    initialize: function (options) {
        console.log("Options goalOrTaskInfoView: ", options);
        console.log("model attributes goalOrTaskInfoView: ", this.model.attributes);
        this.render();
    },
    render: function () {
        $(this.el).html(this.template(this.model.attributes));
        return this;
    }
});

app.GoalOrTaskNodeInfoView = Backbone.View.extend({
    el: "#nodeInfo",
    template: _.template($('#goalOrTaskInfoTemplate').html()),
    initialize: function (options) {
        console.log("Options goalOrTaskInfoView: ", options);
        console.log("model attributes goalOrTaskInfoView: ", this.model.attributes);
        this.render();
    },
    render: function () {
        $(this.el).html(this.template(this.model.attributes));
        return this;
    }
});

app.SelectedContextViewTemplate = Backbone.View.extend({
    el: "#selectedContextInfo",
    template: _.template($('#selectedContextViewTemplate').html()),
    initialize: function (options) {
        console.log("Options SelectedContextViewTemplate: ", options);
        console.log("model attributes SelectedContextViewTemplate: ", this.model.attributes);
        this.render();
    },
    render: function () {
        $(this.el).html(this.template(this.model.attributes));
        return this;
    }
});


/**
 * Checkbox utilizada na modal de associação de contextos para mostrar os contextos criados pelo usuário
 */
app.CAContextCheckboxListView = Backbone.View.extend({
    initialize: function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (context) {
            $(self.el).append(new app.CAContextCheckboxListItemView({
                model: context,
                list: app.selectedContextsForGoalOrTask
            }).render().el);
        });
    },
    render: function (eventName) {
        _.each(this.model.models, function (context) {
            $(this.el).append(new app.CAContextCheckboxListItemView({
                model: context,
                list: app.selectedContextsForGoalOrTask
            }).render().el);
        }, this);
        return this;
    },
    recreateList: function () {
        var self = this;
        // this.model = options.list;
        // Apaga todas as views atuais
        // var allChildren = $(self.el).children("div").remove();
        var allChildren = $(self.el).children("div").children();
        _.each(this.model.models, function (fact) {
            var i = 0;
            for (i; i < allChildren.length; i++) {
                var contextName = allChildren[i].attributes.for.nodeValue;
                _.each(app.selectedContextsForGoalOrTask.models, function (selectedContext) {
                    // DEBUG
                    // console.log('Selected Fact: ', selectedFact.attributes.factName);
                    // console.log('fact: ', factName);
                    if (contextName === selectedContext.attributes.contextName) {
                        allChildren[i].parentNode.remove(); // Remove div completa
                    }
                });
            }
        });
    },
    /**
     * Recria lista usando contextList original
     */
    startOver: function () {
        this.model = app.contextList;
        var self = this;
        // Remove todos os elementos
        $(self.el).children("div").remove();
        // Recria todos
        _.each(this.model.models, function (context) {
            console.log('adding new view');
            $(self.el).append(new app.CAContextCheckboxListItemView({
                model: context,
                list: app.selectedContextsForGoalOrTask
            }).render().el);
        });
        app.contextCheckboxListView =
            new app.CAContextCheckboxListView({
                el: "#contextCheckboxListContextAssociation",
                model: app.contextList,
                list: app.selectedContextsForGoalOrTask
            });
        // $('#contextCheckboxListContextAssociation').html(app.contextCheckboxListView.render({
        //     model: app.contextList}).el);
    }
});

/**
 * View individual da checkbox usada na modal de associação de contextos para mostrar os contextos criados pelo usuário
 */
app.CAContextCheckboxListItemView = Backbone.View.extend({
    events: {
        'click input': 'setAsSelectedOrUnselect'
    },
    template: _.template($('#tpl-context-checkbox-list-item').html()),
    initialize: function (options) {
        this.collection = options.list;
        this.model.bind("change", this.render, this);
        this.model.bind("remove", this.unrender, this);
    },
    render: function (eventName) {
        console.log("app.CAContextCheckboxListItemView render called");
        $(this.el).html(this.template(this.model.toJSON()));
        console.log(this.model);
        return this;
    },
    unrender: function () {
        console.log("Unrender called");
        //DEBUG
        // console.log("app.removedFact.id typeof: ",
        // typeof (parseInt(app.removedFact.id)));
        // console.log("app.removedFact.attributes.factName).val() typeof",
        // typeof(parseInt($("#"+app.removedFact.attributes.factName).val())) );
        // A linha abaixo continua sinalizando uma string vazia sendo passada, apenas no navegador Firefox isso acontece
        // Eu fui pesquisar, e a referência disse que esse problema é específico do Firefox:
        // https://pt.stackoverflow.com/questions/159754/string-vazia-passada-para-getelementbyid
        // O Cast para number foi feito pois a IDE ficava reclamando, e de fato podia causar problemas de consistência,
        // com javascript, qualquer cuidado é pouco...
        if (parseInt(app.removedContext.id) === parseInt($("#" + app.removedContext.attributes.contextName).val())) {
            this.$el.unbind();
            this.$el.remove();
        }
    },
    setAsSelectedOrUnselect: function (e) {
        e.target.checked ? this.collection.add(this.model)
            : this.collection.remove(this.model);
        // DEBUG
        console.log('Opção selecionada: ', e.target.value);
        console.log('CAContextCheckboxListItemView setAsSelectedOrUnselect this.collection.models: ',
            this.collection.models);
    }
});
app.contextCheckboxListView =
    new app.CAContextCheckboxListView({
        el: "#contextCheckboxListContextAssociation",
        model: app.contextList,
        list: app.selectedContextsForGoalOrTask
    });

app.contextAsssociationFixedExpression = "";

app.ContextAssociationDecompositionPreviewView = Backbone.View.extend({
    tag: 'div',
    el: '#CAdecompositionPreviewView',
    template: _.template($('#CADecompositionPreviewViewTemplate').html()),
    events: {
        'click #contextAssociationCreateAnotherDecompositionButton': 'finishAndStartNewExpression'
    },
    initialize: function () {
        this.$andDecomposition = $("#CAdecompositionAndOptionRadio");
        this.$orDecomposition = $("#CAdecompositionOrOptionRadio");
        this.decompositionType = this.$andDecomposition.is(':checked') ? "&" : "|";
        this.$createAnotherDeoompButton = $('#contextAssociationCreateAnotherDecompositionButton');

        this.$andDecomposition.bind("change", this.redefineDecompositionType);
        this.$orDecomposition.bind("change", this.redefineDecompositionType);
        this.$andDecomposition.bind("change", this.render);
        this.$orDecomposition.bind("change", this.render);

        app.selectedContextsForGoalOrTask.bind("add remove", this.render);
        this.$el.html(this.template);
        this.render();
    },
    redefineDecompositionType: function () {
        this.decompositionType = $("#CAdecompositionAndOptionRadio").is(':checked') ? "&" : "|";
    },
    finishAndStartNewExpression: function () {
        this.$expressionView = $("#caDpvExpressionView");
        var expressaoAtual = this.$expressionView.text();
        // DEBUG
        console.log('Expressão atual: ', expressaoAtual);

        var newDecompCollection = new app.ContextList();
        var selectedContextsNames = app.selectedContextsForGoalOrTask.pluck('contextName');
        var contextListNames = app.contextList.pluck('contextName');
        var reducedCollection = _.difference(contextListNames, selectedContextsNames);
        // DEBUG
        console.log('contextList: ', contextListNames);
        console.log('selectedContextsNames: ', selectedContextsNames);
        console.log('reducedCollection: ', reducedCollection);


        if (reducedCollection.length === 0) { // Selecionou todos os contextos
            alert("You cannot create another decomposition, since you've selected all contexts available.\n" +
                "Please unselect some contexts or create new ones to create another decomposition!");
        } else if (app.selectedContextsForGoalOrTask.length === 0) {
            alert("You have not selected any contexts, please select some and try again");
        } else { // Contextos sobrando são adicionados à nova view
            var i = 0;
            for (i; i < reducedCollection.length; i++) {
                var context = app.contextList.findWhere({contextName: reducedCollection[i]});
                newDecompCollection.add(context);
                // DEBUG
                console.log('Unselected context: ', context);
            }
            console.log('newDecompCollection: ', newDecompCollection.models);
            var checkboxes = app.contextCheckboxListView.$el.children("div").children("label").children("input");
            console.log('checkboxes: ', checkboxes);
            console.log("Are all checked?", checkboxes.not('checked').length <= 0);
            var uncheckCounter = 0;
            _.each(checkboxes, function (checkbox) {
                // DEBUG
                // console.log('Is', checkbox.id, 'checkbox checked:', checkbox.checked === true);
                if (checkbox.checked === false) {
                    uncheckCounter++;
                }
            });
            if (uncheckCounter > 0) { // Então tem pelo menos um que não foi checked
                // Fecha parênteses
                this.$expressionView.html("<span>(" + expressaoAtual + ")</span>");
                // Por fim, cria uma nova view com as novas opções de decomposição, onde o usuário poderá fazer um OR ou um
                // AND novamente
                app.contextCheckboxListView.recreateList({list: newDecompCollection});
                app.contextAssociationChooseDecompTypeModal.$el.modal({keyboard: false, backdrop: 'static'});
            } else {
                alert("You cannot create another decomposition, since you've selected all facts available!");
            }
        }
    },
    render: function () {
        var expressionDecomp = "";
        this.decompositionType = $("#CAdecompositionAndOptionRadio").is(':checked') ? "&" : "|";
        this.$el = $("#CAdecompositionPreviewView");
        this.$expressionView = $("#caDpvExpressionView");
        var size = app.selectedContextsForGoalOrTask.length;
        if (size === 0) {
            if (app.contextAsssociationFixedExpression.length === 0) {
                this.$expressionView.html("<span>Select a context and a decomposition to start!</span>");
            } else {
                this.$expressionView.html("<span>" + app.contextAsssociationFixedExpression + "</span>");
            }
        }
        if (size === 1) {
            if (app.contextAsssociationFixedExpression.length === 0) {
                this.$expressionView.html(app.selectedContextsForGoalOrTask.at(0).attributes.contextName);
            } else {
                expressionDecomp = app.contextAsssociationFixedExpression +
                    app.selectedContextsForGoalOrTask.at(0).attributes.contextName;
                this.$expressionView.html(expressionDecomp);
            }
        } else if (size > 1) {
            var i;
            for (i = 0; i < size; i++) {
                if (i !== size - 1) {
                    expressionDecomp += app.selectedContextsForGoalOrTask.at(i).attributes.contextName + " ";
                    expressionDecomp += this.decompositionType + " ";
                } else {
                    expressionDecomp += app.selectedContextsForGoalOrTask.at(i).attributes.contextName;
                }
            }
            if (app.contextAsssociationFixedExpression.length === 0) {
                this.$expressionView.html("<span>" + expressionDecomp + "</span>");
            } else {
                this.$expressionView.html("<span>" + app.contextAsssociationFixedExpression + expressionDecomp + "</span>");
            }
            // DEBUG
            console.log("Expressão: ", expressionDecomp);
        }
        return this;
    },
    fixExpressionAndStartNewOne: function (decompType) {
        console.log("fixExpressionAndStartNewOne() init function");
        console.log('Decomposition type: ', decompType);
        // remove os contextos já selecionados, pra evitar bugs
        app.selectedContextsForGoalOrTask.reset();
        this.$expressionView = $("#caDpvExpressionView");
        var fixedExpression = this.$expressionView.text();
        // Impedir que o que for escrito a partir de agora interfira na expressão anterior, que já foi "fechada"
        var expressionDecomp = fixedExpression.lastIndexOf(")");
        console.log('decompExpression: ', expressionDecomp);
        app.contextAsssociationFixedExpression = fixedExpression.substring(0, expressionDecomp + 1);
        // Adiciona a nova decomposição ao final da expressão, depois libera o uso da expressão para o usuário
        app.contextAsssociationFixedExpression += " " + decompType + " ";
    }
});
app.contextAssociationDecompositionPreviewView = new app.ContextAssociationDecompositionPreviewView();

app.CAChooseDecompTypeModal = Backbone.View.extend({
    el: '#CAchooseDecompTypeModal',
    events: {
        'click button#confirmNewDecompositionType': 'checkData',
        'click button#closeChooseDecompModal': 'checkIfButtonIsChecked',
        'click button.close.btn-close': 'checkIfButtonIsChecked',
    },
    initialize: function () {
        this.$name = this.$("#decompositionNameInput");
        this.$previousAndDecomposition = this.$("#previousDecompositionAndOptionRadio");
        this.$previousOrDecomposition = this.$("#previousDecompositionOrOptionRadio");
    },
    checkData: function () {
        // DEBUG
        console.log("and:", this.$previousAndDecomposition.is(':checked'));
        console.log("Or:", this.$previousOrDecomposition.is(':checked'));
        if (this.$previousOrDecomposition.is(':checked') || this.$previousAndDecomposition.is(':checked')) {
            return true;
        } else {
            alert('Choose an decomposition type!');
            return false;
        }
    },
    checkIfButtonIsChecked: function () {
        // DEBUG
        console.log("CA checkIfButtonIsChecked init function");
        if (this.checkData()) {
            this.submitPreviousDecomposition();
        }
    },
    submitPreviousDecomposition: function () {
        var decompType = this.$previousOrDecomposition.is(':checked') ? "|" : "&";
        app.contextAssociationDecompositionPreviewView.fixExpressionAndStartNewOne(decompType);
        app.contextAssociationDecompositionPreviewView.render();
        this.$el.modal('hide');
    }
});

app.contextAssociationChooseDecompTypeModal = new app.CAChooseDecompTypeModal();

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



