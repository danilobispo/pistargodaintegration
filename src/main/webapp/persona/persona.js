/**
 * Arquivo criado para encapsular todas as funções javascript que envolvam o Persona-Based Modelling
 */

/**
 * Responsável por remover botões que não fazem parte do CGM proposto para o Persona-based modelling
 */
function alterarControlesDaUI() {
    // TODO: Remover botões que não fazem parte do CGM proposto para o Persona-based modelling
    // por exemplo: Role e Agent, Contribution Links, Resource, etc

    // Role e Agent não fazem parte
    $('li[parent="#addActorDropdown"]:has(a[id="addRole"])').hide();
    $('li[parent="#addActorDropdown"]:has(a[id="addAgent"])').hide();

    // Actor links não serão utilizados
    $('#dropdownMenuActorLink').hide();

    //Contribution Link (softgoals podem entrar novamente, só não serão considerados no CGM
    // o famoso "peso morto")
    $('#dropdownMenuContributionLink').hide();
}

/**
 * Responsável por restaurar os controles da UI quando o Persona-based modelling não estiver ativo
 */
function restaurarControlesDaUI() {
    $('li[parent="#addActorDropdown"]:has(a[id="addRole"])').show();
    $('li[parent="#addActorDropdown"]:has(a[id="addAgent"])').show();

    $('#dropdownMenuActorLink').show();
    $('#dropdownMenuContributionLink').show();

    if ($("#sidebar").hasClass('')) {
        $("#sidebar").toggleClass("active");
    }
}

/**
 * Limpa o diagrama atual, garantindo que o usuário não utilize um diagrama PiStar que pode conter
 * elementos não previstos no modelo CGM de Persona-Based Modelling
 */
function removerDiagramaAtual() {
    istar.clearModel();
}

function runAchievability() {
    return function () {
        var model = saveModel();
        var persona = JSON.stringify(app.selectedPersona);
        console.log(persona);
        $.ajax({
            type: "POST",
            url: '/achievability',
            data: {
                "content": model,
                "persona": persona
            },
            success: function () {
                // window.location.href = 'prism.zip';
                alert("Deu bom!");
            },
            error: function () {
                alert("Error!");
            }
        });
    };
}

function exampleAchievability() {
    return function () {
        loadModel("{\n" +
            "  \"actors\": [\n" +
            "    {\n" +
            "      \"id\": \"de78133e-daa8-4484-9038-135003598cc5\",\n" +
            "      \"text\": \"Mobee\",\n" +
            "      \"type\": \"istar.Actor\",\n" +
            "      \"x\": 77,\n" +
            "      \"y\": 124,\n" +
            "      \"nodes\": [\n" +
            "        {\n" +
            "          \"id\": \"3f734e92-ed0c-4152-9001-8f742bbad3db\",\n" +
            "          \"text\": \"G1: Transport info is shared [G3#G4]\",\n" +
            "          \"type\": \"istar.Goal\",\n" +
            "          \"x\": 385,\n" +
            "          \"y\": 151,\n" +
            "          \"customProperties\": {\n" +
            "            \"selected\": \"true\"\n" +
            "          }\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"c7a179f7-b3aa-43e7-92d3-52cbcddf83eb\",\n" +
            "          \"text\": \"G3: Manual data is sent [G9#G8]\",\n" +
            "          \"type\": \"istar.Goal\",\n" +
            "          \"x\": 251,\n" +
            "          \"y\": 244,\n" +
            "          \"customProperties\": {\n" +
            "            \"creationProperty\": \"assertion condition c2 | c3 | c4\"\n" +
            "        }\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"4c01389a-bcde-42f8-8d99-d3b7cbaa2b9f\",\n" +
            "          \"text\": \"G4: Automatic data is sent\",\n" +
            "          \"type\": \"istar.Goal\",\n" +
            "          \"x\": 477,\n" +
            "          \"y\": 245,\n" +
            "          \"customProperties\": {\n" +
            "            \"creationProperty\": \"assertion condition c1 | c3 | c4\"\n" +
            "          }\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"1288f213-9ad0-4d93-a9aa-5d6ca396100d\",\n" +
            "          \"text\": \"G9: Qualification is collected\",\n" +
            "          \"type\": \"istar.Goal\",\n" +
            "          \"x\": 164,\n" +
            "          \"y\": 337,\n" +
            "          \"customProperties\": {\n" +
            "            \"creationProperty\": \"assertion condition c1 | c3\"\n" +
            "          }\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"c281eb93-abc0-4466-b469-698a26b5b82e\",\n" +
            "          \"text\": \"G8: Modification is collected\",\n" +
            "          \"type\": \"istar.Goal\",\n" +
            "          \"x\": 320,\n" +
            "          \"y\": 340\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"6da9a1a8-d22e-45bf-a28e-24a03daeee88\",\n" +
            "          \"text\": \"T1: Track line location\",\n" +
            "          \"type\": \"istar.Task\",\n" +
            "          \"x\": 478,\n" +
            "          \"y\": 336\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"e8ea7a55-a1ab-4f07-8076-0e61c50d429a\",\n" +
            "          \"text\": \"T1: Process modification\",\n" +
            "          \"type\": \"istar.Task\",\n" +
            "          \"x\": 327,\n" +
            "          \"y\": 432,\n" +
            "          \"customProperties\": {\n" +
            "            \"creationProperty\": \"assertion condition c2 | c4\"\n" +
            "          }\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"a5b18920-a039-4827-a8ef-ae67f6d881a2\",\n" +
            "          \"text\": \"T1: Process qualification [T1.1;T1.2]\",\n" +
            "          \"type\": \"istar.Task\",\n" +
            "          \"x\": 165,\n" +
            "          \"y\": 435,\n" +
            "          \"customProperties\": {\n" +
            "            \"creationProperty\": \"assertion condition c2 & c4\"\n" +
            "          }\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"0053dec8-999b-4374-adb2-7a609ccc2396\",\n" +
            "          \"text\": \"T1.1: Testing\",\n" +
            "          \"type\": \"istar.Task\",\n" +
            "          \"x\": 77,\n" +
            "          \"y\": 537,\n" +
            "          \"customProperties\": {\n" +
            "            \"creationProperty\": \"assertion condition (c1 | c2) & (c3 | c4)\"\n" +
            "          }\n" +
            "        },\n" +
            "        {\n" +
            "          \"id\": \"c45a33b6-fd30-4504-ac3f-12c8095d592f\",\n" +
            "          \"text\": \"T1.2: Exception\",\n" +
            "          \"type\": \"istar.Task\",\n" +
            "          \"x\": 239,\n" +
            "          \"y\": 541\n" +
            "        }\n" +
            "      ]\n" +
            "    }\n" +
            "  ],\n" +
            "  \"dependencies\": [],\n" +
            "  \"links\": [\n" +
            "    {\n" +
            "      \"id\": \"c538a1b1-d43a-41b3-b5d5-5af1c6fadd35\",\n" +
            "      \"type\": \"istar.AndRefinementLink\",\n" +
            "      \"source\": \"4c01389a-bcde-42f8-8d99-d3b7cbaa2b9f\",\n" +
            "      \"target\": \"3f734e92-ed0c-4152-9001-8f742bbad3db\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"id\": \"8a4e9eab-fd4b-4a1c-9eed-3f9786da36ee\",\n" +
            "      \"type\": \"istar.AndRefinementLink\",\n" +
            "      \"source\": \"c7a179f7-b3aa-43e7-92d3-52cbcddf83eb\",\n" +
            "      \"target\": \"3f734e92-ed0c-4152-9001-8f742bbad3db\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"id\": \"2a2de391-9a68-4522-8dda-6fc6128413a6\",\n" +
            "      \"type\": \"istar.AndRefinementLink\",\n" +
            "      \"source\": \"1288f213-9ad0-4d93-a9aa-5d6ca396100d\",\n" +
            "      \"target\": \"c7a179f7-b3aa-43e7-92d3-52cbcddf83eb\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"id\": \"08f8be20-f8b1-4186-8c27-0c150b757f11\",\n" +
            "      \"type\": \"istar.AndRefinementLink\",\n" +
            "      \"source\": \"c281eb93-abc0-4466-b469-698a26b5b82e\",\n" +
            "      \"target\": \"c7a179f7-b3aa-43e7-92d3-52cbcddf83eb\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"id\": \"011434e6-550b-4ba9-9142-8262c32bf52e\",\n" +
            "      \"type\": \"istar.OrRefinementLink\",\n" +
            "      \"source\": \"a5b18920-a039-4827-a8ef-ae67f6d881a2\",\n" +
            "      \"target\": \"1288f213-9ad0-4d93-a9aa-5d6ca396100d\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"id\": \"675744d0-6817-44fb-b75a-b5b35d33891c\",\n" +
            "      \"type\": \"istar.OrRefinementLink\",\n" +
            "      \"source\": \"e8ea7a55-a1ab-4f07-8076-0e61c50d429a\",\n" +
            "      \"target\": \"c281eb93-abc0-4466-b469-698a26b5b82e\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"id\": \"bb1e7683-9f13-4c90-9379-b254b10a0a38\",\n" +
            "      \"type\": \"istar.OrRefinementLink\",\n" +
            "      \"source\": \"6da9a1a8-d22e-45bf-a28e-24a03daeee88\",\n" +
            "      \"target\": \"4c01389a-bcde-42f8-8d99-d3b7cbaa2b9f\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"id\": \"14caf2c0-1835-46fd-9b94-055699af8a40\",\n" +
            "      \"type\": \"istar.AndRefinementLink\",\n" +
            "      \"source\": \"0053dec8-999b-4374-adb2-7a609ccc2396\",\n" +
            "      \"target\": \"a5b18920-a039-4827-a8ef-ae67f6d881a2\"\n" +
            "    },\n" +
            "    {\n" +
            "      \"id\": \"922438bb-af41-4565-ad9c-52d91cf2e0b1\",\n" +
            "      \"type\": \"istar.AndRefinementLink\",\n" +
            "      \"source\": \"c45a33b6-fd30-4504-ac3f-12c8095d592f\",\n" +
            "      \"target\": \"a5b18920-a039-4827-a8ef-ae67f6d881a2\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"tool\": \"pistar.1.0.0\",\n" +
            "  \"istar\": \"2.0\",\n" +
            "  \"saveDate\": \"Sat, 06 Jan 2018 23:53:39 GMT\",\n" +
            "  \"diagram\": {\n" +
            "    \"width\": 1881,\n" +
            "    \"height\": 1172\n" +
            "  }\n" +
            "}");
        var model = saveModel();
        $.ajax({
            type: "POST",
            url: '/achievability-example',
            data: {
                "content": model
            },
            success: function () {
                // window.location.href = 'prism.zip';
                alert("Deu bom!");
            },
            error: function () {
                alert("Error!");
            }
        });
    };
}

$('#personaArea').on('show.bs.collapse', function () {
    $('#personaButton').addClass('active');
    //Persona buttons
    alterarControlesDaUI();
    app.factViewButton = new uiC.ButtonView({
        model: new uiC.ButtonModel({
            label: 'Create Facts',
            name: 'edit_facts_for_contexts_off',
            tooltip: 'Create facts'
        })
    }).render();
    app.factViewButton.$el.click(function () {
        $("#factsModal").modal('show');
    });
    app.contextViewButton = new uiC.ButtonView({
        model: new uiC.ButtonModel({
            label: 'Create Contexts',
            name: 'edit_contexts_off',
            tooltip: 'Create contexts'
        })
    }).render();
    app.contextViewButton.$el.click(function () {
        $("#contextAndDecompositionModal").modal('show');
    });
    app.relateGoalsButton = new uiC.ButtonView({
        model: new uiC.ButtonModel({
            label: 'Relate contexts to goals or tasks',
            name: 'relate_contexts_to_goals_off',
            tooltip: 'Create contexts',
            statusText: 'Click on a goal or task and assign created contexts to it!'
        })
    }).render();
    app.relateGoalsButton.$el.click(function () {
        app.stepThreeSelected = true;
    });
    app.createPersonaViewButton = new uiC.ButtonView({
        model: new uiC.ButtonModel({
            label: 'Create persona',
            name: 'define_personas_off',
            tooltip: 'Define a persona!'
        })
    }).render();
    app.createPersonaViewButton.$el.click(function () {
        $("#personaCreationModal").modal('show');
    });
    app.reviewPersonaViewButton = new uiC.ButtonView({
        model: new uiC.ButtonModel({
            label: 'Review persona',
            name: 'review_your_persona_off',
            action: ui.STATE_VIEW,
            tooltip: 'Create contexts',
            statusText: 'Opens a modal, enabling context creation!'
        })
    }).render();
    app.reviewPersonaViewButton.$el.click(function () {
        $("#sidebar").toggleClass("active");
        $(this).toggleClass("active");
    });
    app.runAchievabilityAlgorithmButton = new uiC.ButtonView({
        model: new uiC.ButtonModel({
            label: 'Run Achievability Algorithm',
            name: 'run_off',
            action: ui.STATE_VIEW,
            tooltip: 'Create contexts'
        })
    }).render();
    app.runAchievabilityAlgorithmButton.$el.click(runAchievability());
});
$('#personaArea').on('hide.bs.collapse', function () {
    $('#personaButton').removeClass('active');
    app.factViewButton.hide();
    app.contextViewButton.hide();
    app.relateGoalsButton.hide();
    app.createPersonaViewButton.hide();
    app.reviewPersonaViewButton.hide();
    app.runAchievabilityAlgorithmButton.hide();
    restaurarControlesDaUI();

});

$('#finishCGMButton').click(function () {
    let model = JSON.parse(saveModel());
    let i = 0;
    for (i; i < model.links.length; i++) {
        console.log(model.links[i]);
    }
});

/**
 * Cria a árvore CGM que será analisada no passo de achievability
 * @param model
 */
function montarArvoreCGM(model) {
    let i = 0;
    // Pega todos os nós d

    let linksTarget;
    let linksSource;
    for (i; i < model.nodes.length; i++) {

    }
}

$("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
    $(this).toggleClass("active");
});

$('.persona-fact-button').click(function () {
    $(this).toggleClass('highlight')
});

$("#showFactsLink").click(function () {
    new app.FactListView();
    $("#showFactsLink").innerText = "Hide List";
});




