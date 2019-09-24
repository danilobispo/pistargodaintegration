/**
 * Arquivo criado para encapsular todas as funções javascript que envolvam o Persona-Based Modelling
 */

/**
 * Responsável por remover botões que não fazem parte do CGM proposto para o Persona-based modelling
 */
function alterarControlesDaUI(){
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

    if($("#sidebar").hasClass('')){
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

$('#personaArea').on('show.bs.collapse', function () {
    $('#personaButton').addClass('active');
    //Persona buttons
    alterarControlesDaUI();
    app.factViewButton = new uiC.ButtonView({model: new uiC.ButtonModel({
            label: 'Create Facts', 
            name: 'edit_facts_for_contexts_off', 
            tooltip:'Create facts'})}).render();
    app.factViewButton.$el.click(function () {
        $("#factsModal").modal('show');
    });
    app.contextViewButton = new uiC.ButtonView({model: new uiC.ButtonModel({
            label: 'Create Contexts',
            name: 'edit_contexts_off',
            tooltip:'Create contexts'})}).render();
    app.contextViewButton.$el.click(function () {
        $("#contextAndDecompositionModal").modal('show');
    });
    app.relateGoalsButton = new uiC.ButtonView({model: new uiC.ButtonModel({
            label: 'Relate contexts to goals or tasks', 
            name: 'relate_contexts_to_goals_off', 
            tooltip:'Create contexts', 
            statusText: 'Click on a goal or task and assign created contexts to it!'})}).render();
    app.relateGoalsButton.$el.click(function () {
        app.stepThreeSelected = true;
    });
    app.createPersonaViewButton = new uiC.ButtonView({model: new uiC.ButtonModel({
            label: 'Create persona', 
            name: 'define_personas_off', 
            tooltip:'Define a persona!'})}).render();
    app.createPersonaViewButton.$el.click(function () {
        $("#personaCreationModal").modal('show');
    });
    app.reviewPersonaViewButton = new uiC.ButtonView({model: new uiC.ButtonModel({
            label: 'Review persona', 
            name: 'review_your_persona_off', 
            action: ui.STATE_VIEW, 
            tooltip:'Create contexts', 
            statusText:'Opens a modal, enabling context creation!'})}).render();
    app.reviewPersonaViewButton.$el.click(function () {
        $("#sidebar").toggleClass("active");
        $(this).toggleClass("active");
    });
    app.runAchievabilityAlgorithmButton = new uiC.ButtonView({model: new uiC.ButtonModel({
            label: 'Run Achievability Algorithm', 
            name: 'run_off', 
            action: ui.STATE_VIEW, 
            tooltip:'Create contexts'})}).render();
    app.runAchievabilityAlgorithmButton.$el.click(runAchievability());
    $('#runAchievabilityButton').click(runAchievability());
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
    for(i; i < model.links.length; i++){
        console.log(model.links[i]);
    }

    // TODO: Descobrir como gravar/ler o JSON no Local Storage
    /*var localStorage = unsafeWindow.localStorage;
    if(localStorage.length > 0){
        console.log("kkk n tá vazio");
    } else {
        console.log("tá vazio");
    }*/

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
    for(i; i < model.nodes.length; i++){

    }
}

$("#sidebarCollapse").on("click", function() {
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
// USE LATER
/*if($("#patientRadioOption").attr("checked",true)) {
    console.log("KKKKKK PATIENT");

} else if($("#doctorRadioOption").attr("checked",true)) {
    console.log("KKKKKK DOCTOR");
}*/


