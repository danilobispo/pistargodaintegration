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

$('#personaArea').on('show.bs.collapse', function () {
    $('#personaButton').addClass('active');
    alterarControlesDaUI();
});
$('#personaArea').on('hide.bs.collapse', function () {
    $('#personaButton').removeClass('active');
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
// USE LATER
/*if($("#patientRadioOption").attr("checked",true)) {
    console.log("KKKKKK PATIENT");

} else if($("#doctorRadioOption").attr("checked",true)) {
    console.log("KKKKKK DOCTOR");
}*/



